import {Router} from 'express'
import { verifyJWT } from '../middlewares/auth.middlewares.js'
import { addContacts, getDetails, loginUser, registerUser } from '../controller/user.controller.js'
const router=Router()

router.route("/login").post(loginUser)
router.route("/register").post(registerUser)
router.route("/addContact").post(verifyJWT,addContacts)
router.route("/getUser").get(verifyJWT,getDetails)


export default router
