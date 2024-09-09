import {Router} from 'express'
import { verifyJWT } from '../middlewares/auth.middlewares.js'
import { addContacts, deleteContact, getDetails, loggedOutUser, loginUser, registerUser } from '../controller/user.controller.js'
const router=Router()

router.route("/login").post(loginUser)
router.route("/register").post(registerUser)
router.route("/addContact").post(verifyJWT,addContacts)
router.route("/getUser").get(verifyJWT,getDetails)
router.route("/deleteContact").post(verifyJWT,deleteContact)
router.route("/logOut").post(verifyJWT,loggedOutUser)


export default router
