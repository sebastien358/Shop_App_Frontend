<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import AlertMessage from '@/templates/alertMessage/AlertMessage.vue'
import { useProductAdminStore } from '@/stores/admin/productAdminStore.ts'
import { useCategoryAdminStore } from '@/stores/admin/categoryAdminStore.ts'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useRoute } from 'vue-router'

const productAdminStore = useProductAdminStore()

const categoryAdminStore = useCategoryAdminStore()

// Récupération des catégories

const categories = computed(() => categoryAdminStore.category)

onMounted(async () => {
  await categoryAdminStore.getAdminCategories()
})

const route = useRoute()

type Pictures = {
  id: number
  filename: string
}

type Product = {
  id: number
  pictures: Pictures[]
}

const stateProduct = reactive<Product>({
  id: 0,
  pictures: [],
})

// Initialisation des valeurs

const initialValues = {
  id: 0,
  title: '',
  description: '',
  price: 0,
  category: {
    id: 0,
    name: '',
  },
}

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    if (!id) return

    const product = await productAdminStore.currentProduct(id)
    if (!product) return

    Object.assign(stateProduct, {
      ...product,
    })

    setValues({
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category.id,
    })
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
    .refine((files) => {
        if (!files) return true
        return files.every((file) => file.size <= MAX_FILE_SIZE && ['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
      },
      {
        message: 'Chaque fichier doit faire moins de 5Mo et être au format JPEG, PNG ou WEBP',
      },
    ),
})

const { handleSubmit, isSubmitting, setValues } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues,
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
  SUCCESS_EDIT_PRODUCT: 'Le produit a bien été modifié',
  INVALID_CREDENTIALS: 'Une erreur est survenue',
}

const onSubmit = handleSubmit(async (dataProduct, { resetForm }) => {
  try {
    if (route.params.id) {
      const response = await productAdminStore.editProduct(dataProduct, route.params.id)
      if (!response) {
        setErrorMessage(MESSAGES.INVALID_CREDENTIALS)
        return
      }
      setSuccessMessage(MESSAGES.SUCCESS_EDIT_PRODUCT, null)
    } else {
      const response = await productAdminStore.addAdminProduct(dataProduct)
      if (!response) {
        setErrorMessage(MESSAGES.INVALID_CREDENTIALS)
        return
      }
      setSuccessMessage(MESSAGES.SUCCESS_ADD_PRODUCT, resetForm)
    }
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

// Delete image

const deleteImage = async (productId: number, imageId: number) => {
  try {
    await productAdminStore.deleteProductImage(productId, imageId)
    stateProduct.pictures = stateProduct.pictures.filter((image) => image.id !== imageId)
  } catch (e) {
    console.error(e)
  }
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
  <main class="container">
    <section class="container-form">
      <h3>Ajouter un produit</h3>
      <!-- Form Add Product -->
      <form @submit.prevent="onSubmit" class="product-form">
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
        <div class="product-form__button">
          <button class="btn btn-black" :disabled="isSubmitting">
            <span v-if="isSubmitting">Chargement...</span>
            <span v-else>Ajouter un produit</span>
          </button>
        </div>
      </form>
    </section>

    <section class="product-image" v-if="stateProduct">
      <div v-for="picture in stateProduct.pictures" :key="picture.id">
        <img v-if="picture.filename" :src="picture.filename" class="img-product" />
        <img v-else src="@/assets/images/not-found.webp" class="img-product" />
        <div class="product-image__button">
          <button @click="deleteImage(stateProduct.id, picture.id)" class="btn btn-danger">
            delete
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  height: calc(100vh - 96px);
  @media (max-width: 768.98px) {
    padding: 10px;
  }
  .container-form {
    max-width: 1000px;
    padding: 30px 20px 15px 20px;
    h3 {
      font-size: 20px;
      margin-bottom: 5px;
      @media (max-width: 768.98px) {
        text-align: center;
      }
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
  @media (max-width: 768.98px) {
    grid-template-columns: repeat(1, 1fr);
  }
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

.product-form__button {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  @media (max-width: 768.98px) {
    justify-content: center;
  }
  .btn-black {
    font-size: 14px;
    @media (max-width: 768.98px) {
      font-size: 12px;
    }
  }
}

// Product image

.product-image {
  .img-product {
    height: 200px;
  }
  &__button {
    margin-top: 5px;
    display: flex;
    justify-content: center;
  }
}
</style>
