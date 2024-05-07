import Post from '../models/post.Model.js';
import User from '../models/user.Model.js';
import {v2 as cloudinary} from 'cloudinary'
export const createPost = async(req, res) => {
    try {
        const {postedBy, text} = req.body;
        let {img} = req.body;
        if (!postedBy || !text) {
            return res.status(404).json({error:"Please fill all the fields"})
        }
        if (!text) {
            return res.status(404).json({error:"Please fill all the fields"})
        }
        const user = await User.findById(postedBy);
        if (!user) {
            res.status(404).json({error:"User not found"})
        }
        const textMaxLeangth = 500;
        if (text.length > textMaxLeangth) {
            res.status(400).json({error:`Text must be less then ${textMaxLeangth} chareacters.`})
        }
        if (!user._id.toString() === req.user._id.toString()) {
            res.status(404).json({error:"Unothorized to create post"})
        }
        if (img) {
            const uplodedResponce = await cloudinary.uploader.upload(img)
            img = uplodedResponce.secure_url;
        }
        const newPost = new Post({postedBy, text, img});
        await newPost.save();
        res.status(200).json(newPost)
        console.log("Post Done", newPost);
    } catch (error) {
        res.status(500).json({error:error.message});
        console.log("Error in createPost controller", error);
    }
}

export const getPost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		res.status(200).json(post);
	} catch (err) {
		res.status(500).json({ error: err.message });
        console.log('error in get post1');
	}
};

export const deletePost = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(400).json({error:"post not found"})
        }
        if (post.postedBy.toString() !== req.user._id.toString()) {
            return res.status(400).json({error:"Unothorized to delete the post"})
        }
        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId)
            console.log("img deleted");
        }
        await Post.findByIdAndDelete(req.params.id)
        res.status(201).json({message:"Post deleted successfully"})
    } catch (error) {
        res.status(500).json({error:error.message});
        console.log("Error in deletePost controller", error);
    }
}

export const likeUnlikePost = async(req, res) => {
    try {
        const {id:postId} = req.params;
        const userId = req.user._id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({error:"post not found"})
        }
        const isUserLiked = post.likes.includes(userId)
        if (isUserLiked) {
            await Post.findByIdAndUpdate({_id:postId},{$pull:{likes:userId}})
            res.status(201).json({message:"User unliked post successfully"})
        } else{
            post.likes.push(userId);
            await post.save()
            res.status(201).json({message:"User liked post successfully"})

        }

    } catch (error) {
        res.status(500).json({error:error.message});
        console.log("Error in likePost controller", error);
    }
}

export const replyUser = async(req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;
        const {text} = req.body;
        const userProfilePic = req.user.userProfilePic;
        const userName = req.user.userName;

        if (!text) {
            res.status(400).json({error:"Please fill the all fields"})
        }
        const post = await Post.findById(postId);
        if (!post) {
            res.status(400).json({error:"post not found"})
        }
        const reply = {userId, text, userProfilePic, userName};
        post.replies.push(reply);
        await post.save();
        res.status(201).json( reply )

    } catch (error) {
        res.status(500).json({error:error.message});
        console.log("Error in replyPost controller", error);
    }
}

export const getFeedPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const following = user.following;

		const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

		res.status(200).json(feedPosts);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getUserPosts = async(req, res) => {
    const {userName} = req.params;
    try {
        const user =await User.findOne({userName})
        if (!user) {
        res.status(404).json({ error: "User not found"});
        return;
        }
        const posts = await Post.find({ postedBy : user._id}).sort({createdAt : -1 });
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({ error: error.message });
        return;
    }

}