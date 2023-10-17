import mongoose from "mongoose";

const bookSchema =new mongoose.Schema({
title:{
    type:String,
    required:true
},
ref:{
    type:String,
    required:true
},
author:{
    type:String,
    required:true
},
dateref:{
    type:Date,
    requied:false
},
NumofBook:{
    type:Number,
    requied:true
},
available:{
type:Boolean,
requied:true
}
})
const bookModel = mongoose.model("book", bookSchema);
export default bookModel;