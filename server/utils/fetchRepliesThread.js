import Post from '../models/postModels.js'
async function fetchRepliesThread(postId){
    const replies= await Post.find({parentId:postId})
    
    const repliesThread= []
    for(let reply of replies){
        const childReplies= await fetchRepliesThread(reply._id)
        repliesThread.push(reply,...childReplies)
    } 
    
    return repliesThread
}

export default fetchRepliesThread