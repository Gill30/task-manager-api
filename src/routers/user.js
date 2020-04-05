const express = require('express')
// const sharp = require('sharp')
const User = require("../models/users")
const router = new express.Router()
const auth  =require("../middleware/auth")
const multer = require('multer')

router.post("/users", async (req, res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }catch(e){
        res.status(400).send(e)
    }
    // user.save().then(()=>{
    //     res.status(201).send(user)
    // }).catch((error)=>{
    //     res.status(400)
    //     res.send(error)
    // })
})

router.post('/users/login', async (req, res)=>{
    try{ 
        const user = await User.findByCredententials(req.body.email, req.body.password)
        //console.log(user)
        const token = await user.generateAuthToken()
        
        res.send({user , token})
    }catch(e){
        res.status(400).send()
    }
})

router.post("/users/logout", auth, async (req, res )=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token != req.token
        })

        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})

router.post("/users/logout/all", auth, async (req, res )=>{
    try{
        req.user.tokens = []

        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})
router.get("/users/me", auth,async (req, res)=>{
    res.status(200).send(req.user)
    // try{
    //     const users = await User.find({})
    //     res.status(200).send(users)
    // }catch(e){
    //     res.status(500).send(e)
    // }
    // User.find({}).then((users)=>{
    //     res.status(200).send(users)
    // }).catch((error)=>{
    //     res.status(500)
    //     res.send(error)
    // })
})

router.get("/users/all", auth,async (req, res)=>{
    
    try{
        const users = await User.find({})
        const all_users = []

        users.forEach((item)=>{
            all_users.push({
                username : item.name,
                userID : item._id
            })
        })
        res.status(200).send(all_users)
    }catch(e){
        res.status(500).send(e)
    }
    // User.find({}).then((users)=>{
    //     res.status(200).send(users)
    // }).catch((error)=>{
    //     res.status(500)
    //     res.send(error)
    // })
})

// router.get("/users/:id", async (req, res)=>{
//     const _id = req.params.id
//     try{
//         const user = await User.findById(_id)
//         if(!user){
//             debugger
//             res.status(404).send("User Not Found")
//         }

//         res.status(200).send(user)
//     }catch(e){
//         res.status(500).send(e)
//     }
        // User.findById(_id).then((user)=>{
    //     if(!user){
    //         return res.status(404).send("User not found")
    //     }
    //     res.status(200).send(user)
    // }).catch((error)=>{
    //     res.status(500)
    //     res.send(error)
    // })
// })

router.patch("/users/me", auth, async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({ error : "Invalid key"})
    }
    try{
        // const user = await User.findById(req.params.id)
        updates.forEach((update)=>{
            req.user[update] = req.body[update]
        })
        await req.user.save()
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators: true})
        //if there is no user
        // if(!user){
        //     res.status(404).send("User not found")
        // }

        res.status(200).send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete("/users/me", auth, async (req, res)=>{
    try{
        // const user = await User.findByIdAndDelete(req.params.id)
        
        // if(!user){
        //    return res.status(404).send("User Not Found")
        // }

        await req.user.remove()

        res.status(200).send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

const upload = multer({
    // dest : 'avatars',
    limits : {
        fileSize : 10000000
    }, 
    fileFilter (req, file, cb){
        // !file.originalname.endsWith('.pdf')
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res)=>{
    // const buffer = await sharp(req.file.buffer).resize({width: 250 , height: 250}).png().toBuffer()
    req.user.avatar = req.file.buffer//buffer
    
    await req.user.save()
    res.send()
}, (error, req, res, next)=>{
    res.status(400).send({error : error.message})
})

router.delete('/users/me/avatar', auth, async(req, res)=>{
    req.user.avatar = undefined
    try{
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
    
})

router.get('/users/:id/avatar',  async(req, res)=>{
    
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(500).send()
    }
    
})

module.exports = router;
