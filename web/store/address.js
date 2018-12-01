import { getDetail, getHistoryOnAddress } from '~/lib/api';
import { tablizeAddress, tablizeHistory } from '~/lib/util';

export const state = () => ({
    id: "",
    page: 0,
    pagesize: 15,
    data: null,
    historyData: null,
    historyDataDetail: null
});

export const mutations = {
    resetData: (state, id) => {
        state.id = id;
        state.data = null;
        state.historyData = null;
        state.historyDataDetail = null;
    },
    updateDataMut: (state, thing={}) => {
        Object.keys(thing).forEach(k => {
            state[k] = thing[k];
        });
    },
    updatePageMut: (state, page) => {
        state.page = page;
        state.historyData = null;
        state.historyDataDetail = null;
    }
};

export const actions = {
    async updateData ({ commit, dispatch, state }) {
        await Promise.all([
                getDetail("address", state.id).then(data => {
                    commit('updateDataMut', {data: tablizeAddress(data.data.data)});
                }),
                dispatch("updateHistory")
            ]);
    },
    async more({ commit, dispatch, state }, adder) {
        if (!adder) return;
        if (state.historyData && state.historyData.length < state.pagesize && adder > 0) return;
        if (state.page + adder < 0) return;  
        commit('updatePageMut', state.page + adder);
        await dispatch('updateHistory');
    },
    async updateHistory ({ commit, state }) {
        let data = await getHistoryOnAddress(state.id, state.page, state.pagesize);
        let [historyData, historyDataDetail] = tablizeHistory(data.data.data);
        commit('updateDataMut', {historyData, historyDataDetail});
    }
};