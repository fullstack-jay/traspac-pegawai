import { defineStore } from 'pinia'
import { employeeService } from '~/services/employeeService'
import type { Employee, EmployeeFilter, PaginationMeta } from '~/types/employee'

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    employees: [] as Employee[],
    selectedEmployee: null as Employee | null,
    loading: false,
    saving: false,
    error: null as string | null,
    meta: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    } as PaginationMeta,
    filter: {
      search:       '',
      unitKerja:    '',
      golongan:     '',
      eselon:       '',
      jenisKelamin: '',
      sortBy:       'id',
      sortDir:      'asc',
    } as EmployeeFilter,
    unitKerjaList: [] as string[],
  }),

  getters: {
    hasEmployees: (state) => state.employees.length > 0,
  },

  actions: {
    async fetchEmployees(page = 1) {
      this.loading = true
      this.error = null
      try {
        const res = await employeeService.getEmployees(this.filter, page, this.meta.limit)
        this.employees = res.data
        this.meta = res.meta
      } catch (err: any) {
        this.error = err.message || 'Gagal memuat data pegawai'
      } finally {
        this.loading = false
      }
    },

    async fetchEmployee(id: string) {
      this.loading = true
      this.error = null
      try {
        this.selectedEmployee = await employeeService.getEmployee(id)
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async createEmployee(data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) {
      this.saving = true
      this.error = null
      try {
        const emp = await employeeService.createEmployee(data)
        await this.fetchEmployees(1)
        return emp
      } catch (err: any) {
        this.error = err.message
        throw err
      } finally {
        this.saving = false
      }
    },

    async updateEmployee(id: string, data: Partial<Employee>) {
      this.saving = true
      this.error = null
      try {
        const emp = await employeeService.updateEmployee(id, data)
        await this.fetchEmployees(this.meta.page)
        return emp
      } catch (err: any) {
        this.error = err.message
        throw err
      } finally {
        this.saving = false
      }
    },

    async deleteEmployee(id: string) {
      this.saving = true
      this.error = null
      try {
        await employeeService.deleteEmployee(id)
        await this.fetchEmployees(this.meta.page)
      } catch (err: any) {
        this.error = err.message
        throw err
      } finally {
        this.saving = false
      }
    },

    async fetchUnitKerjaList() {
      this.unitKerjaList = await employeeService.getUnitKerjaList()
    },

    setFilter(filter: Partial<EmployeeFilter>) {
      this.filter = { ...this.filter, ...filter }
    },

    resetFilter() {
      this.filter = { search: '', unitKerja: '', golongan: '', eselon: '', jenisKelamin: '' }
    },

    setPageSize(limit: number) {
      this.meta.limit = limit
    },
  },
})
