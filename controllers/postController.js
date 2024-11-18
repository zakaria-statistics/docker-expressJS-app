const Post = require("../models/postModel");

// Get all posts
exports.getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.find();

        res.status(200).json({
            status: "success",
            results: posts.length,
            data: {
                posts,
            },
        });
    } catch (e) {
        res.status(400).json({
            status: "fail",
            message: e.message,
        });
    }
};

// Get a single post by ID
exports.getOnePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                status: "fail",
                message: "Post not found",
            });
        }

        res.status(200).json({
            status: "success",
            data: {
                post,
            },
        });
    } catch (e) {
        res.status(400).json({
            status: "fail",
            message: e.message,
        });
    }
};

// Create a new post
exports.createPost = async (req, res, next) => {
    try {
        console.log("Incoming request body:", req.body);
        const post = await Post.create(req.body);

        res.status(201).json({
            status: "success",
            data: {
                post,
            },
        });
    } catch (e) {
        console.log(e)
        res.status(400).json({
            status: "fail",
            message: e.message,
        });
    }
};

// Update an existing post by ID
exports.updatePost = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!post) {
            return res.status(404).json({
                status: "fail",
                message: "Post not found",
            });
        }

        res.status(200).json({
            status: "success",
            data: {
                post,
            },
        });
    } catch (e) {
        res.status(400).json({
            status: "fail",
            message: e.message,
        });
    }
};

// Delete a post by ID
exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);

        if (!post) {
            return res.status(404).json({
                status: "fail",
                message: "Post not found",
            });
        }

        res.status(204).json({
            status: "success",
            data: null,
        });
    } catch (e) {
        res.status(400).json({
            status: "fail",
            message: e.message,
        });
    }
};
