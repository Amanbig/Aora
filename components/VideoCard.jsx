import { View, Text,Image,TouchableOpacity } from 'react-native'
import React from 'react'
import { icons } from '../constants'
import { Video,ResizeMode } from 'expo-av'

const VideoCard = ({video:{title, thumbnail, video, creator:{ username, avatar}}}) => {
    const [play, setplay] = useState(false)
  return (
    <View className='flex-col items-center px-4 mb-14'>
        <View className='flex-row gap-3 items-start'>
            <View className='justify-center items-center flex-row flex-1'>
                <View className='w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5'>
                    <Image
                        source={{uri:avatar}}
                        className='w-full h-full rounded-lg'
                        resizeMode='cover'
                    />
                </View>
                <View className='justify-center flex-1 ml-3 gap-y-1'>
                    <Text className='text-white font-psemibold text-sm' numberOfLines={1}>
                        {title}
                    </Text>
                    <Text className='text-xs text-gray-100 font-pregular' numberOfLines={1}>
                       {username} 
                    </Text>
                </View>
            </View>
            <View className='pt-4'>
                <Image source={icons.menu} className='w-5 h-5' resizeMode='contain'/>
            </View>
        </View>
        {play? (
            <Video source={{uri:video}} className='w-full h-60 rounded-xl mt-3' resizeMode={ResizeMode.CONTAIN} useNativeControls shouldPlay onPlaybackStatusUpdate={(status)=>{
                if(status.didJustFinish){
                    setplay(false)
                }
            }}/>
        ):
        <TouchableOpacity className='w-full h-60 rounded-xl mt-3 relative justify-center items-center' activeOpacity={0.7} onPress={()=>setplay(true)}>
            <Image source={{uri:thumbnail}} className='w-full h-full rounded-xl mt-3' resizeMode='cover'/>
            <Image source={icons.play} className='w-12 h-12 absolute' resizeMode='contain'/>
        </TouchableOpacity>}
    </View>
  )
}

export default VideoCard