import { View, Text, SafeAreaView, FlatList, Image, RefreshControl, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { getAllPosts, getLatestPosts, searchPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useLocalSearchParams } from 'expo-router'

const Search = () => {
  const {query} = useLocalSearchParams()
  const { data: posts, refetch } = useAppwrite(searchPosts(query))
  const [Refresencing, setRefresencing] = useState(false)

  useEffect(()=>{
    refetch()
  },[query])
  return (
    <SafeAreaView className='bg-primary pt-4 h-full'>
      <FlatList
        data={posts}
        // data={[]}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard video={item}/>
        )}
        ListHeaderComponent={() => (
          <View className='my-6 px-4'>
                <Text className='font-pmedium text-sm text-gray-100'>
                  Search Results
                </Text>
                <Text className='text-2xl font-psemibold text-white'>
                  {query}
                </Text>
                <View>
                  
                </View>
                  <SearchInput initialQuery={query}/>
              </View>
        )}
        ListEmptyComponent={() => {
          <EmptyState title='No videos found' subtitle="Be the first one to upload a video" />
        }}
      />

    </SafeAreaView>
  )
}

export default Search