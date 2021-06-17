export interface IDict {
    id: string
    dict_code: string
    code: string
    name: string
}

export interface IState {
    groupRoles: any[]
    branchRoles: any[]
    departments: any[]
    managementScope: any[]
    data: IDict[]
}

export default {
    namespaced: true,
    state: (): IState => ({
        groupRoles: [],
        branchRoles: [],
        departments: [],
        managementScope: [],
        data: []
    }),
    mutations: {
        updateGroupRoles(state, data) {
            state.groupRoles = data
        },
        updateBranchRoles(state, data) {
            state.branchRoles = data
        },
        updateDepartments(state, data) {
            state.departments = data
        },
        updateManagementScope(state, data) {
            state.managementScope = data
        },
        updateDict(state, data) {
            state.data = [...data]
        }
    }
}
