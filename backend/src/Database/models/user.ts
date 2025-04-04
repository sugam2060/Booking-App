import mongoose from "mongoose";
import bcrypt from 'bcryptjs'


export type UserType = {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    IsCustomer: boolean
}

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    IsCustomer: {type: Boolean, default: true}
})

userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,8)
    }
    next()
})

export const User = mongoose.model<UserType>('user',userSchema);