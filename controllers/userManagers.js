const { getRandomId } = require("vk-io");
const { _API_VK } = require("../instance");
const Likes = require("../models/likes");
const User = require("../models/user");

class UserController {

    async get({ id }) {
        return await User.findOne({ id }).lean();
    }

    async getRandomUser({ myId, age, city, gender }) {
        /// поиск диапазона возраста, город без регистра и пол где "все равно" с пагинацией и фильтром на дату создания записи
        if (gender == "all") {
            gender = {
                $in: ['male', 'female']
            }
        }

        const listLikes = await Likes.find({
            whoLiked: myId
        }).select('whoLikedIt').sort({ date: -1 }).lean()

        const listDislikes = await Likes.find({
            whoLikedIt: myId,
            type: 'dislike'
        }).select('whoLiked').sort({ date: -1 }).lean()

        let _listLikes = listLikes
        let _listDislikes = listDislikes

        if (listLikes.length > 0) {
            _listLikes = listLikes.map(el => {
                return el.whoLikedIt
            })
        }

        if (listDislikes.length > 0) {
            _listDislikes = listDislikes.map(el => {
                return el.whoLiked
            })
        }

        const user = await User.findOne({
            "geo.city": { $regex: `${city}`, $options: 'i' },
            "age": { $gte: age - 2, $lte: age + 2 },
            "gender": gender,
            "id": { "$nin": [myId, ..._listLikes, ..._listDislikes] }
        }).sort({ date: -1 }).lean()

        return user
    }

    async likeDislikeUser({ whoLiked, whoLikedIt, message = undefined, type = 'like' }) {
        const isLikeUser = await Likes.findOne({
            whoLiked: whoLikedIt
        }).sort({ date: -1 }).lean()

        if (type == 'like') {
            let text = message ? message : ''
            try {
                if (isLikeUser && isLikeUser.type == 'like') {

                    const userWhoLiked = await User.findOne({ id: whoLiked })
                    const userWhoLikedIt = await User.findOne({ id: whoLikedIt })

                    _API_VK.messages.send({
                        user_id: whoLiked,
                        message: `Взаимная симпатия! \n\n [id${userWhoLikedIt.id}|${userWhoLikedIt.name}], ${userWhoLikedIt.age}, ${userWhoLikedIt.geo.city}\n${userWhoLikedIt.desc}\n\n`,
                        attachment: userWhoLikedIt.photos[0],
                        random_id: getRandomId()
                    }).catch()
                    _API_VK.messages.send({
                        user_id: whoLikedIt,
                        message: `Взаимная симпатия! \n\n [id${userWhoLiked.id}|${userWhoLiked.name}], ${userWhoLiked.age}, ${userWhoLiked.geo.city}\n${userWhoLiked.desc}`,
                        attachment: userWhoLiked.photos[0],
                        random_id: getRandomId()
                    }).catch()


                    userWhoLiked.listOfLikes.push({
                        id: userWhoLikedIt.id,
                        type: 'like'
                    })

                    userWhoLikedIt.listOfLikes.push({
                        id: userWhoLiked.id,
                        type: 'like'
                    })

                    await userWhoLiked.save()
                    await userWhoLikedIt.save()

                    return;
                }
                let obj = {
                    type,
                    // кто лайкнул
                    whoLiked,
                    // кого лайкнули
                    whoLikedIt
                }
                if (message) {
                    obj.message = message
                }

                const likesList = new Likes({ ...obj })
                await likesList.save();

                const countUserLikes = await Likes.count({ whoLikedIt })

                _API_VK.messages.send({
                    user_id: whoLikedIt,
                    message: `Вами заинтересовались ${countUserLikes} человек. В главном меню нажмите список лайкнувших
                    ${text}`,
                    random_id: getRandomId()
                }).catch()
            } catch (error) {
                console.log(error)
            }
        }

        if (type == 'dislike') {

            if (isLikeUser) {
                const userWhoLiked = await User.findOne({ id: whoLiked })
                const userWhoLikedIt = await User.findOne({ id: whoLikedIt })

                userWhoLiked.listOfLikes.push({
                    id: userWhoLikedIt.id,
                    type: 'dislike'
                })

                userWhoLikedIt.listOfLikes.push({
                    id: userWhoLiked.id,
                    type: isLikeUser.type
                })

                await userWhoLiked.save()
                await userWhoLikedIt.save()
            }

            let obj = {
                type,
                // кто лайкнул
                whoLiked,
                // кого лайкнули
                whoLikedIt
            }
            const likesList = new Likes({ ...obj })
            await likesList.save();
        }
        return true;
    }

    async getListLikes({ id }) {

        const iam = await User.findOne({ id }).select('listOfLikes').lean()

        let arr = [];
        if (iam.listOfLikes.length > 0) {
            arr = iam.listOfLikes.map(el => {
                return el.id
            })
        }

        const likeUser = await Likes.findOne({
            whoLikedIt: id,
            type: 'like',
            whoLiked: { "$nin": [...arr] }
        }).select('whoLiked').sort({ date: -1 }).lean()

        if (!likeUser) return undefined;

        const user = await User.findOne({
            "id": likeUser.whoLiked
        }).sort({ date: -1 }).lean()

        return user
    }


}

module.exports = new UserController();