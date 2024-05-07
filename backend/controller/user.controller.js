import User from '../models/user.Model.js'
import bcrypt from 'bcryptjs'
import jwttokenAndSetCookie from '../utils/helper/jwttokenAndSetCookie.js';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import Post from '../models/post.Model.js';
// import Post from '../../frentend/src/component/Post.jsx';
// import { uploadOnCloudinary } from '../utils/cloudinary.js';
export const signupUser = async(req, res)=> {
    try {
        const {fullName, userName, email, password} = req.body;
        
        if (!fullName || !userName || !email || !password) {
            console.log('some thing missing');
            return res.status(400).json({error:'please fill all fields'})
            
        }

        const user = await User.findOne({$or:[{userName}, {email}]});
        if(user){
            return res.status(400).json({error:'User already exist'})
        }

        const salt =await bcrypt.genSalt(8);
        const hashpassword = await bcrypt.hash(password, salt)

        const newUser = User({
            fullName,
            userName,
            email,
            password: hashpassword,
            
        })
        await newUser.save();
        console.log({message:"Signup done!!!!!!!!!"});
        if (newUser) {
            jwttokenAndSetCookie(newUser._id, res)
            res.status(201)
            .json({
                _id:newUser._id,
                fullName:newUser.fullName,
                userName:newUser.userName,
                email:newUser.email,
                bio:newUser.bio,
                userProfilePic:newUser.userProfilePic
            })

        } else{
            return res.status(400).json({error:'invalled user data'})
        }

    } catch (error) {
        res.status(500).json({error: error.message})
        console.log('Error in signUp controller', error);
    }
};

export const loginUser = async(req, res)=>{
    try {
        const {userName, password} = req.body;  

        const user = await User.findOne({userName});
        if (!user) {
            return res.status(400).json({error:'Invalled userName'})
        }
        const isPasswordCorrect = await bcrypt.compare(password, user?.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({error:'Invalled password'})
        }
        if (user.isFrooren) {
            user.isFrooren = false;
            user.save();
        }
        jwttokenAndSetCookie(user._id, res)
        res.status(201)
        .json({
            _id:user._id,
            fullName:user.fullName,
            userName:user.userName,
            email:user.email,
            bio:user.bio,
            userProfilePic:user.userProfilePic
        })

    } catch (error) {
        res.status(500).json({error: error.message})
        console.log('Error in login controller', error);
    }
};

export const logOutUser = async(req, res) => {
    try {
        res.cookie('jwt', "", {maxAge:1})
        res.status(200)
        .json({message: "User logged out successfully"})
    } catch (error) {
        res.status(500).json({error: error.message})
        console.log('Error in logout controller', error);
    }
};

export const followUnfollow = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the user to be followed/unfollowed
        const userToModify = await User.findById(id);
        if (!userToModify) {
            return res.status(404).json({ error: "User not found" });
        }

        // Get the current user
        const currentUser = await User.findById(req.user._id);
        if (!currentUser) {
            return res.status(404).json({ error: "Current user not found" });
        }

        // Check if the user is trying to follow/unfollow themselves
        if (id === req.user._id.toString()) {
            return res.status(400).json({ error: 'You cannot follow/unfollow yourself' });
        }

        // Check if the current user is already following the user
        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            // If already following, unfollow the user
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            res.status(200).json({ message: "User unfollowed successfully" });
        } else {
            // If not following, follow the user
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            res.status(200).json({ message: "User followed successfully" });
        }
    } catch (error) {
        console.error("Error in followUnfollow controller:", error);
        res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req, res) => {
	const { fullName, email, userName, password, bio } = req.body;
	let { userProfilePic } = req.body;
    // console.log("userProfilePic", userProfilePic);
	const userId = req.user._id;
	try {
		let user = await User.findById(userId);
		if (!user) return res.status(400).json({ error: "User not found" });

		if (req.params.id !== userId.toString())
			return res.status(400).json({ error: "You cannot update other user's profile" });

		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			user.password = hashedPassword;
		}

		if (userProfilePic) {
			if (user.userProfilePic) {
				await cloudinary.uploader.destroy(user.userProfilePic.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(userProfilePic);
			userProfilePic = uploadedResponse.secure_url;
            console.log(uploadedResponse.secure_url);
		}

		user.fullName = fullName || user.fullName;
		user.email = email || user.email;
		user.userName = userName || user.userName;
		user.userProfilePic = userProfilePic || user.userProfilePic;
		user.bio = bio || user.bio;

		user = await user.save();

        await Post.updateMany(
            {"replies.userId": userId},
            {
                $set:{
                    "replies.$[reply].userName":user.userName,
                    "replies.$[reply].userProfilePic":user.userProfilePic
                }
            },
            {
                arrayFilters:[{"reply.userId":userId}]
            }
        )

        user.password = null;
        console.log("User update successFully");
        res.status(201).json(user)
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log("error in updateUser controller", error);
    }
};


export const GetProfile = async(req, res) => {
    const {query} = req.params;
    try {
        let user;
        if (mongoose.Types.ObjectId.isValid(query)) {
            user = await User.findById({ _id : query}).select("-password").select("-updatedAt")
        }else {
        user = await User.findOne({userName : query}).select("-password").select("-updatedAt")
        }
        if (!user) {
            return res.status(400).json({error:"user not found"})
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ error: error.message} )
        console.log("error in update updateUser controller", error);
    }
}

export const getSuggestedUser = async(req, res) => {
    try {
        const userId = req.user._id;
        // find our following
        const userFollowedByYou = await User.findById(userId).select("following")
        // get 10 rendom users
        const users = await User.aggregate([
            {$match:{
                _id:{$ne:userId}
            }},
            {
                $sample:{size:10}
            }
        ])
        
        const filteredUsers = users.filter((user) => !userFollowedByYou.following.includes(user._id))
        const suggestedUser = filteredUsers.slice( 0, 4 )
        suggestedUser.forEach(user => user.password = null)
        res.status(200).json(suggestedUser)
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log("error in suggestedUser controller from 222", error.message);
    }
}

export const freezAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        if(!user) {
            return res.status(404).json({error:"User not found"})
        }
        user.isFrooren = true
        await user.save();
        res.status(200).json({success:true})
    } catch (error) {
        req.status(500).json({error:error.message})
    }
}
