<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AlertMessage from '@/templates/alertMessage/AlertMessage.vue'
import { useProductAdminStore } from '@/stores/admin/productAdminStore.ts'
import { useCategoryAdminStore } from '@/stores/admin/categoryAdminStore.ts'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

const productAdminStore = useProductAdminStore()

// Récupération des catégories

const categoryAdminStore = useCategoryAdminStore()
const categories = computed(() => categoryAdminStore.category)

onMounted(async () => {
  try {
    await categoryAdminStore.getAdminCategories()
  } catch (e) {
    console.error(e)
  }
})

// Création Form

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 Mo

const schema = z.object({
  title: z.string({ message: 'Le prénom est requis' }),
  price: z.coerce.number({ message: 'Veuillez renseigner un prix' }),
  category: z.coerce.number({ message: 'Veuillez renseigner une catégorie' }),
  description: z.string({ message: 'Veuillez renseigner une description' }),
  images: z
    .array(z.instanceof(File))
    .optional()
    .refine(
      (files) => {
        if (!files) return true
        return files.every((file) => file.size <= MAX_FILE_SIZE && ['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
      }, {
        message: 'Chaque fichier doit faire moins de 5Mo et être au format JPEG, PNG ou WEBP',
      },
    )
})

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema),
})

const { value: title, errorMessage: errorTitle } = useField<string>('title')
const { value: price, errorMessage: errorPrice } = useField<number>('price')
const { value: category, errorMessage: errorCategory } = useField<string>('category')
const { value: description, errorMessage: errorDescription } = useField<string>('description')
const { value: images, errorMessage: errorImage, setValue } = useField<string>('images')

const changeMultipleFiles = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files) {
    const filesArray: File[] = Array.from(files)
    setValue(filesArray)
  } else {
    setValue([])
  }
}

const MESSAGES = {
  SUCCESS_ADD_PRODUCT: 'Le produit a bien été ajouté',
  INVALID_CREDENTIALS: 'Une erreur est survenue',
}

const onSubmit = handleSubmit(async (dataProduct, { resetForm }) => {
  try {
    const response = await productAdminStore.addAdminProduct(dataProduct)
    if (!response) {
      setErrorMessage(MESSAGES.INVALID_CREDENTIALS)
      return
    }
    setSuccessMessage(MESSAGES.SUCCESS_ADD_PRODUCT, resetForm)
  } catch (e) {
    console.error(e)
    setErrorMessage(MESSAGES.INVALID_CREDENTIALS)
  }
})

// Gestion des messages d'erreurs

const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

let reset = () => {}

function setSuccessMessage(message: string, resetForm: () => void) {
  errorMessage.value = null
  successMessage.value = message
  reset = resetForm
}

function setErrorMessage(message: string) {
  successMessage.value = null
  errorMessage.value = message
}

function closeFields() {
  successMessage.value = null
  errorMessage.value = null
}

function handleResetForm() {
  closeFields()
  reset()
}

const fields = [
  {
    label: 'Titre',
    type: 'text',
    name: 'title',
    value: title,
    css: 'label',
    errorMessage: errorTitle,
  },
  {
    label: 'Prix',
    type: 'number',
    name: 'price',
    value: price,
    css: 'label',
    errorMessage: errorPrice,
  },
  {
    label: 'Catégorie',
    type: 'select',
    name: 'category',
    value: category,
    css: 'label-select',
    errorMessage: errorCategory,
  },
  {
    label: 'Image',
    type: 'file',
    name: 'image',
    value: images,
    css: null,
    errorMessage: errorImage,
  },
]
</script>

<template>
  <div class="d-flex align-items-center justify-content-center product-form">
    <div class="container-form">
      <h3>Ajouter un produit</h3>
      <!-- Form Add Product -->
      <form @submit.prevent="onSubmit">
        <div class="input-column">
          <div v-for="(field, index) in fields" :key="index">
            <div class="d-flex flex-column form-group">
              <label :for="field.label" :class="field.css">{{ field.label }}</label>
              <input
                v-if="field.type === 'text' || field.type === 'number'"
                v-model="field.value.value"
                :type="field.type"
                :name="field.name"
              />
              <input
                v-if="field.type === 'file'"
                :type="field.type"
                :name="field.name"
                @change="changeMultipleFiles($event)"
                multiple
              />
              <select v-if="field.type === 'select'" v-model="category">
                <option value="">-- Veuillez sélectionner une catégorie --</option>
                <option v-for="cat in categories" :value="cat.id" :key="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
            <span v-if="field.errorMessage" class="error-field">{{ field.errorMessage }}</span>
          </div>
        </div>
        <!-- Input select -->
        <div class="d-flex flex-column form-group">
          <label class="label-description">Description</label>
          <textarea v-model="description" rows="5"></textarea>
          <span v-if="errorDescription" class="error-field">{{ errorDescription }}</span>
        </div>
        <!-- Gestion messages de validations -->
        <div class="text-center">
          <AlertMessage
            v-if="successMessage"
            :message="successMessage"
            type="success"
            redirectTo=""
            @close="handleResetForm()"
            class="alert-message"
          />
          <AlertMessage
            v-if="errorMessage"
            :message="errorMessage"
            type="error"
            redirectTo=""
            @close="handleResetForm()"
            class="alert-message"
          />
        </div>
        <div class="d-flex align-items-center mt-10 flex-end">
          <button class="btn btn-black" :disabled="isSubmitting">
            <span v-if="isSubmitting">Chargement...</span>
            <span v-else>Ajouter un produit</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.product-form {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  height: calc(100vh - 96px);
  .container-form {
    max-width: 1000px;
    padding: 30px 20px 15px 20px;
    h3 {
      font-size: 20px;
      margin-bottom: 5px;
    }
    .alert-message {
      margin-top: 10px;
      text-align: center;
    }
  }
}

.input-column {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 18px;
}

.form-group {
  margin-top: 20px;
  label {
    font-size: 9px;
    border: 1px solid black;
    border-bottom: none;
    height: 23px;
    width: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  input,
  select,
  textarea {
    border: 1px solid black;
    padding: 12px;
    outline: none;
    background-color: var(--text-primary-color);
    &:focus {
      border: 3px solid black;
      padding: 11px;
    }
  }
  .label-image {
    width: 90px;
    white-space: nowrap;
  }
  .label-select {
    width: 65px;
    white-space: nowrap;
  }
  .label-description {
    width: 65px;
    white-space: nowrap;
  }
  &:focus-within label {
    background-color: black;
    color: var(--text-primary-color);
  }
  .message-field {
    color: var(--success-2);
  }
}
</style>
