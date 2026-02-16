export const validatePost = (req, res, next) => {
  try {
    const { title, image , category_id , description ,content ,status_id  } = req.body;
    const badRequestNull = [];
    const badRequestType=[];

    if(!title){
        badRequestNull.push("Title is required");
    }
    if(!image){
        badRequestNull.push("Image is required");
    }
    if(!category_id){
        badRequestNull.push("Category is required");
    }
    if(!description){
        badRequestNull.push("Description is required");
    }
    if(!content){
        badRequestNull.push("Content is required");
    }
    if(!status_id){
        badRequestNull.push("Status is required");
    }

    if(badRequestNull.length > 0){
        return res.status(400).json({ message: badRequestNull });
    }
    
    if(typeof(title)!=='string'){
        badRequestType.push("Title must be a string");
    }
    if(typeof(image)!=='string'){
        badRequestType.push("Image must be a string");
    }
    if(typeof(category_id)!=='number'){
        badRequestType.push("Category must be a number");
    }
    if(typeof(description)!=='string'){
        badRequestType.push("Description must be a string");
    }
    if(typeof(content)!=='string'){
        badRequestType.push("Content must be a string");
    }
    if(typeof(status_id)!=='number'){
        badRequestType.push("Status must be a number");
    }

    if(badRequestType.length > 0){
        return res.status(400).json({ message: badRequestType });
    }

    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  next();
};
