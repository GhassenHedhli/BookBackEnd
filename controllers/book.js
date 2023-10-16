import bookModel from "../models/book.js";


export const addBook=async(req,res)=>{
    try{
    const booksData = await bookModel.findOne({ref:req.body.ref})
    if(!booksData){
        const newbook=await bookModel.create(req.body);
        return res.status(201).json({booksData:newbook, message: 'Book added successfully' });
    }
    res.status(201).json({ message: 'Book already exists' });
}
catch(err){res.status(404).json({ message: err.message })}
}
export const getBook=async(req,res)=>{
    try{
        const booksData =await  bookModel.find({ref:req.body.ref});
        if(!booksData){return res.status(401).json({message:'Book not found'});}
        res.status(200).json(booksData);
    }
    catch(err){
        res.status(404).json({ message: err.message });

    }
}

export const updateBook=async(req,res)=>{
    const { ref } = req.params;
    const updatedBookData = req.body;
  try{
    const updatedBook = await bookModel.findOneAndUpdate({ ref }, updatedBookData, { new: true });
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(updatedBook);
  }
  catch(err){res.status(404).json({message:err.message});}
}

export const deleteBook=async(req,res)=>{
    const { ref } = req.params;
    try{
      const deletedBook = await bookModel.findOneAndDelete({ref});
      if (!deletedBook) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      res.status(200).json({ message: 'Book deleted successfully' });
  
    }
    catch(err){res.status(404).json({message:err.message});}
  }