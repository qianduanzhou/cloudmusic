import * as types from './mutation-types'
import {shuffle} from '../common/utils'
import axios from 'axios'

async function getSongUrl(song) {
    await axios.get('http://localhost:3000/song/url',{
            params: {
                id: song.mid
            }
        }).then((result) => {
            let res = result.data
            let url = res.data[0].url
            song.url = url
        })
    return song
}


function findIndex(list,song) {
    return list.findIndex((item) => {
        return item.mid === song.mid
    })
}

export const selectPlay = function ({commit,state},{list,index}) {
    commit(types.SET_PLAYLIST,list)
    if(state.songs.mode == 'random') {
        
        let randomList = shuffle(list)
        commit(types.SET_PLAYLIST,randomList)
        index = findIndex(randomList,list[index])
    }else {
        commit(types.SET_SEQUENCE_LIST,list)
    }
    commit(types.SET_SINGER,list[index].singer)
    commit(types.SET_CURRENT_INDEX,index)
    commit(types.SET_FULL_SCREEN,false)
    commit(types.SET_PLAY_STATE,true)
}

export const insertSong = function ({commit,state},song) {
    let sequenceList = state.songs.sequenceList.slice(0)
    let playList = state.songs.playList.slice(0)
    let index = state.songs.currentIndex
    index = index + 1
    let seIndex = findIndex(sequenceList,song)
    if(seIndex > -1) {
        getSongUrl(song).then((song1) => {
            sequenceList[seIndex] = song1
            playList[seIndex] = song1
            commit(types.SET_SEQUENCE_LIST,sequenceList)
            commit(types.SET_PLAYLIST,playList)
            commit(types.SET_SINGER,song1.singer)
            commit(types.SET_CURRENT_INDEX,seIndex)
            commit(types.SET_FULL_SCREEN,false)
            commit(types.SET_PLAY_STATE,true)
        }) 
    }else {
        sequenceList.splice(index,0,song)
        playList.splice(index,0,song)
        commit(types.SET_SEQUENCE_LIST,sequenceList)
        commit(types.SET_PLAYLIST,playList)

        commit(types.SET_SINGER,song.singer)
        commit(types.SET_CURRENT_INDEX,index)
        commit(types.SET_FULL_SCREEN,false)
        commit(types.SET_PLAY_STATE,true)
    }
    
}

