import { View, Text,FlatList,TouchableOpacity,ImageBackground,Image  } from 'react-native'
import React,{useState} from 'react'
import * as Animatable from 'react-native-animatable'
import { ResizeMode, Video,resizeMode } from 'expo-av'

const zoomIn = {
    0:{
        scale:0.9
    },
    1:{
        scale:1.1,
    }
}

const zoomOut = {
    0:{
        scale:1.1
    },
    1:{
        scale:0.9
    }
}

const TredingItem = ({activeItem,item})=>{
    const [play, setplay] = useState(false)
    return(
    <Animatable.View className='mr-5' animation={activeItem===item.$id ? zoomIn:zoomOut} duration={500}>
        {play ? <Video source={{uri:item.video}} className='w-52 h-72 rounded-[35px] mt-3 bg-white/10' resizeMode={ResizeMode.CONTAIN} useNativeControls shouldPlay onPlaybackStatusUpdate={(status)=>{
            if(status.didJustFinish){
                setplay(false)
            }
        }}/>:(
            <TouchableOpacity className='relative justify-center items-center' activeOpacity={0.7} 
            onPress={()=>setplay(true)}
            >
                <ImageBackground source={{uri:item.thumbnail}} className='w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40' resizeMode='cover'/>
                <Image source={icons.play} className='w-12 h-12 absolute' resizeMode='contain'/>
            </TouchableOpacity>
        )}
    </Animatable.View>
    )
}

const Trending = ({posts}) => {
    const [activeItem, setActiveItem] = useState(posts[1])

    const viewableItemChanges = ({viewableItems})=>{
        if(viewableItems.length>0){
            setActiveItem(viewableItems[0].key)
        }
    }
  return (
    <FlatList
        data={posts}
        keyExtractor={(item)=>item.$id}
        renderItem={({item})=>(
            <TredingItem activeItem={activeItem} item={item}/>
        )}
        onViewableItemsChanged={viewableItemChanges}
        viewabilityConfig={{
            itemVisiblePercentThreshold:70
        }}
        contentOffset={{x:170}}
        horizontal
    />
  )
}

export default Trending