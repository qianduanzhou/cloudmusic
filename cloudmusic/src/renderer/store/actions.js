import * as types from './mutation-types'
import {shuffle} from '../common/utils'

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


