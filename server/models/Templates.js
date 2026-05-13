import mongoose from "mongoose"

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, 
  imageKitUrl: { type: String, required: true },
  isPremium: { type: Boolean, default: false },
  
  overlayConfig: {
    textPosition: { x: Number, y: Number },
    imagePosition: { x: Number, y: Number, radius: Number },
    fontColor: { type: String, default: '#FFFFFF' }
  }
})

const Template = mongoose.model("Template", templateSchema)
export default Template