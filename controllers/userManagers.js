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

        let _list = listLikes

        if (listLikes.length > 0) {
            _list = listLikes.map(el => {
                return el.whoLikedIt
            })
        }

        const user = await User.findOne({
            "geo.city": { $regex: `${city}`, $options: 'i' },
            "age": { $gte: age - 2, $lte: age + 2 },
            "gender": gender,
            "id": { "$nin": [myId, ..._list] }
        }).sort({ date: -1 }).lean()

        return user
    }

    async likeDislikeUser({ whoLiked, whoLikedIt, message = undefined, type = 'like' }) {
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
        if (type == 'like') {
            let text = message ? message : ''
            try {
                const countUserLikes = await Likes.count({ whoLikedIt })
                /*
                console.log(countUserLikes)
                console.log(`Вами заинтерисовались ${countUserLikes} человек. Посмотреть?`)
                */
                await _API_VK.messages.send({
                    user_id: whoLikedIt,
                    message: `Вами заинтересовались ${countUserLikes} человек. Посмотреть?
                    ${text}`,
                    random_id: getRandomId()
                })
            } catch (error) {
                console.log(error)
            }
        }
        return true;
    }

    async getListLikes({ id }) {

        const likeUser = await Likes.findOne({
            whoLiked: id
        }).sort({ date: -1 }).lean()

        if (!likeUser) return undefined;

        const user = await User.findOne({
            "id": likeUser.whoLikedIt
        }).sort({ date: -1 }).lean()

        return user
    }


}

module.exports = new UserController();