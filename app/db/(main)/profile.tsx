import mongoose, {Document, Schema} from 'mongoose'

export interface IProfile extends Document {
    name: string
    id: number
}

const profileSchema:Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true
    }
})

const Profile = mongoose.models.Profile || mongoose.model<IProfile>('Profile', profileSchema)

export default Profile;