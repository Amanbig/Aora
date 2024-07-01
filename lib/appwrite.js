import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite"
export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    plaform: 'com.jsm.aora',
    projectId: '668038bd00143d0b9e85',
    databaseId: '66803a070020acd32e66',
    userCollectionId: '66803a2f001fd0eb403f',
    videoCollectionId: '66803a7a0027ef205207',
    storageId: '66803c56003654dc3b73'
}


const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.plaform);

const account = new Account(client)
const avatars = new Avatars(client)
const databases = new Databases(client)

export const createUser = async (email,password,username) => {
    try{
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username,
        )

        if(!newAccount) throw Error;
        const avatarUrl = avatars.getInitials(username)
        await signIn(email,password);
        const newUser = await databases.createDocument(appwriteConfig.databaseId,appwriteConfig.userCollectionId, ID.unique(),{
            accountId: newAccount.$id,
            email,
            username,
            avatar:avatarUrl,
        })
        return newUser;
    }catch(error){
        console.log(error)
        throw new Error(error)
    }
}
export async function signIn(email,password){
    try{
        const session = await account.createEmailPasswordSession(email,password)
        return session;
    }catch(error){
        console.log(error)
        throw new Error(error)
    }
}

export const getCurrentUser = async()=>{
    try{
        const currentAccount = await account.get()
        if(!currentAccount){
            throw Error
        }
        
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId',currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0]
    }catch(error){
        console.log(error)
    }
}

export const getAllPosts = async()=>{
    try{
        const posts = await databases.listDocuments(appwriteConfig.databaseId,appwriteConfig.videoCollectionId)
        return posts.documents;
    }catch(error){
        console.log(error)
    }
}

export const getLatestPosts = async()=>{
    try{
        const posts = await databases.listDocuments(appwriteConfig.databaseId,appwriteConfig.videoCollectionId,[Query.orderDesc('$createdAt',Query.limit(7))])
        return posts.documents;
    }catch(error){
        console.log(error)
    }
}

export const searchPosts = async(query)=>{
    try{
        const posts = await databases.listDocuments(appwriteConfig.databaseId,appwriteConfig.videoCollectionId,[Query.search('title',query)])
        return posts.documents;
    }catch(error){
        console.log(error)
    }
}