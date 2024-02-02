<template>
  <div class="col column">
    <div class="row justify-center">
      <q-card
        class="bg-primary col-md-6 col-12"
      >
        <q-card-section class="text-h4">
          Settings
        </q-card-section>

        <q-separator
          spaced
        />

        <q-card-section>
          <q-form
            ref="formRef"
            class="row q-col-gutter-sm"
            @submit="onSubmit"
          >
            <q-input
              v-model.trim="webDAV.id"
              label="kDrive ID *"
              :rules="[Rules.required, Rules.validKDriveID]"
              lazy-rules
              class="col-12 col-md-6 error-white"
              input-class="text-white"
              filled
              maxlength="10"
              label-color="white"
              color="white"
              type="text"
            />

            <q-input
              v-model.trim="webDAV.dir"
              label="WebDAV folder *"
              :rules="[Rules.required, Rules.string, Rules.validFileNameOrFolder]"
              lazy-rules
              class="col-12 col-md-6 error-white"
              input-class="text-white"
              filled
              maxlength="30"
              label-color="white"
              color="white"
              type="text"
            >
              <template #append>
                <q-icon
                  name="fa fa-circle-info"
                  color="white"
                >
                  <q-tooltip>
                    For security reasons, you need to create a folder at the root of your kDrive, <br> which the application will point to in order to manage your files.
                  </q-tooltip>
                </q-icon>
              </template>
            </q-input>

            <q-input
              v-model.trim="webDAV.username"
              label="kDrive email *"
              :rules="[Rules.required, Rules.string, Rules.validEmail]"
              lazy-rules
              class="col-12 col-md-6 error-white"
              input-class="text-white"
              filled
              maxlength="255"
              label-color="white"
              color="white"
              type="email"
            />

            <q-input
              v-model.trim="webDAV.password"
              label="kDrive password *"
              :rules="[Rules.required, Rules.string]"
              lazy-rules
              class="col-12 col-md-6 error-white"
              input-class="text-white"
              filled
              maxlength="255"
              label-color="white"
              color="white"
              type="password"
            >
              <template #append>
                <q-icon
                  name="fa fa-circle-info"
                  color="white"
                >
                  <q-tooltip>
                    If two-step validation is not enabled, use the password for your Infomaniak account. <br>
                    If two-step validation is enabled, generate an application password here: https://manager.infomaniak.com/v3/profile/application-password.
                  </q-tooltip>
                </q-icon>
              </template>
            </q-input>
          </q-form>
        </q-card-section>
      </q-card>
    </div>

    <div
      class="row justify-center items-center"
      :class="{
        'q-mt-md': $q.screen.lt.md
      }"
    >
      <q-card
        class="bg-primary col-md-6 col-12"
      >
        <q-card-section style="font-size: .7rem">
          <q-icon name="fa fa-info" />
          <a
            class="text-white text-weight-bold q-ml-sm"
            href="https://www.infomaniak.com/en/support/faq/2409/connect-to-kdrive-via-webdav"
            target="_blank"
          >Infomaniak connect to kDrive via webDAV</a>
        </q-card-section>
      </q-card>
    </div>
  </div>

  <q-page-sticky
    position="bottom-right"
    :offset="[18, 18]"
  >
    <save-button
      @click="onSubmit()"
    />
  </q-page-sticky>
</template>

<script setup lang="ts">
import { Rules } from 'src/utils/rules'
import {
  DEFAULT_WEBDAV_STATE,
  useSettingsStore
} from 'stores/settings'
import {
  onBeforeMount,
  ref,
} from 'vue'
import {
  Notify,
  QForm
} from 'quasar'
import { storeToRefs } from 'pinia'
import cloneDeep from 'lodash/fp/cloneDeep'
import { useKeyboardListener } from 'src/composables/keyboardListener'
import SaveButton from 'components/SaveButton.vue'

const settingsStore = useSettingsStore()

const {
  webdav,
} = storeToRefs(settingsStore)

const webDAV = ref<typeof DEFAULT_WEBDAV_STATE>({})
const formRef = ref<InstanceType<typeof QForm> | null>(null)

useKeyboardListener({
  'Control-s': {
    callback: (e: KeyboardEvent) => {
      e.preventDefault()
      onSubmit()
    }
  }
})

async function onSubmit () {
  const isValid = await formRef.value?.validate()

  if (!isValid) {
    Notify.create({
      message: 'Settings not saved',
      caption: 'Please, check fields value',
      color: 'primary',
      textColor: 'white',
      timeout: 2000,
    })

    return
  }

  webdav.value = cloneDeep(webDAV.value)
  Notify.create({
    message: 'Settings saved',
    color: 'primary',
    textColor: 'white',
    timeout: 2000,
  })
}

onBeforeMount(async () => {
  webDAV.value = cloneDeep(webdav.value)
})
</script>

<style scoped>

</style>