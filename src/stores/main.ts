import { defineStore } from 'pinia'
import {
  createClient,
  type WebDAVClient,
} from 'webdav'
import { WebDAVApi } from 'src/utils/webdav'
import { useSettingsStore } from 'stores/settings'

interface State {
  ready: boolean
  client?: WebDAVClient
  filePath: string
  api?: WebDAVApi
}

export const useMainStore = defineStore({
  id: 'main',

  state: (): State => ({
    ready: false,
    client: undefined,
    filePath: '/notes.json',
    api: undefined,
  }),

  getters: {
    apiOrThrow (): WebDAVApi {
      const api = this.api

      if (typeof api === 'undefined') {
        throw new Error('Api not found')
      }

      return api
    },
  },

  actions: {
    async connect () {
      this.client = undefined
      this.api = undefined
      this.ready = false

      const settingsStore = useSettingsStore()
      const webDAV = settingsStore.webdav

      if (
        typeof webDAV.id === 'undefined' ||
        typeof webDAV.username === 'undefined' ||
        typeof webDAV.password === 'undefined'
      ) {
        return false
      }

      this.client = createClient(
        `https://${webDAV.id}.connect.kdrive.infomaniak.com/${webDAV.dir}`,
        {
          username: webDAV.username,
          password: webDAV.password,
        },
      )

      this.api = new WebDAVApi(this.client, this.filePath)
      this.ready = await this.api.isPathExist('')

      return true
    },
  },
})
