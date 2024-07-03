import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";
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

    const account = new Account(client);
    const storage = new Storage(client);
    const avatars = new Avatars(client);
    const databases = new Databases(client);

    export { account, storage, avatars, databases };

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

export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
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

export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("creator", userId)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function searchPosts(query) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("title", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Upload File
export async function uploadFile(file, type) {
  if (!file) {
    throw new Error("No file provided");
  }

  const asset = {
    name: file.fileName, // or another appropriate property from file
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}


// Get File Preview
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Create Video Post
export const createVideoPost = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    console.log(thumbnailUrl)
    console.log(videoUrl)

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    console.error("Error creating video post:", error);
    throw new Error(error);
  }
};
