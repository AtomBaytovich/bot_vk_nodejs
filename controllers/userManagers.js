const { getRandomId } = require("vk-io");
const { _API_VK } = require("../instance");
const Likes = require("../models/likes");
const User = require("../models/user");

class UserController {

    async create({
        id,
        age,
        gender,
        interestingGender,
        city,
        name,
        desc,
        photos
    }) {
        const newUser = new User({
            id,
            age,
            gender,
            interestingGender,
            geo: {
                city
            },
            name,
            desc,
            photos
        })

        await newUser.save(err => {
            if (err) console.log(err)
        });
        return newUser;
    }

    async get({ id }) {
        return await User.findOne({ id }).lean();
    }

    async getRandomUser({ myId, age, city, gender }) {
        /// поиск диапазона возраста, город без регистра и пол где "все равно" с пагинацией и фильтром на дату создания записи
        console.log(city)

        if (gender == "all") {
            gender = {
                $in: ['male', 'female']
            }
        } 

        const listLikes = await Likes.find({
            whoLiked: myId
        }).select('whoLikedIt').sort({date: -1}).lean()

        let _list = listLikes
        
        if (listLikes.length > 0) {
            _list = listLikes.map(el => {
                return el.whoLikedIt
            })
        }

        const user = await User.findOne({
            "geo.city": { $regex: `${city}`, $options: 'i' },
            "age": { $gte: age-2, $lte: age+2 },
            "gender": gender,
            "id": { "$nin": [myId, ..._list] }
        }).sort({date: -1}).lean()

        return user
        
    }

    async likeUser({ whoLiked, whoLikedIt, message = undefined }) {
        let obj = {
            whoLiked,
            whoLikedIt
        }
        if (message) {
            obj.message = message
        }
        const likesList = new Likes({...obj})

        await likesList.save(async (err) => {
            if (err) {
                throw err
            }
            let text = message ? message : ''
            try {
                await _API_VK.messages.send({
                    user_id: whoLikedIt,
                    message: `Вами заинтерисовался один человек. Посмотреть?
                    ${text}`,
                    random_id: getRandomId()
                })
            } catch (error) {
                console.log(error)
            }
            
        })

        return true;
    }

}

module.exports = new UserController();