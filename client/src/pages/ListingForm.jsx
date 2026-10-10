
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'

const defaults = {
  title: '',
  description: '',
  price: 0,
  category: 'other',
  condition: 'used',
  status: 'active'
}

export default function ListingForm() {
  const nav = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(defaults)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    async function loadListing() {
      try {
        const res = await api.get(`/listings/${id}`)
        const listing = res.data.listing ?? res.data

        setForm({
          title: listing.title,
          description: listing.description ?? '',
          price: Number(listing.price),
          category: listing.category,
          condition: listing.condition,
          status: listing.status
        })
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load listing'
        )
      }
    }

    loadListing()
  }, [id])

  function onChange(e) {
    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      const { title, description, price, category, condition, status } = form

      const data = {
        title,
        description,
        price,
        category,
        condition,
        ...(id ? { status } : {})
      }

      if (id) {
        await api.patch(`/listings/${id}`, data)
      } else {
        await api.post('/listings', data)
      }

      nav('/listings')
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to save listing'
      )
    }
  }

  return (
    <div className="max-w-lg mx-auto card">
      <h1 className="text-xl font-semibold mb-4">
        {id ? 'Edit' : 'New'} Listing
      </h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label htmlFor="title">Title</label>
          <input
            className="input w-full"
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={onChange}
            required
          />
        </div>

        <div>
          <label htmlFor="price">Price</label>
          <input
            className="input w-full"
            id="price"
            name="price"
            type="number"
            min="0"
            step="any"
            value={form.price}
            onChange={onChange}
            required
          />
        </div>

        <div>
          <label htmlFor="category">Category</label>
          <select
            className="input w-full"
            id="category"
            name="category"
            value={form.category}
            onChange={onChange}
            required
          >
            <option value="textbooks">Textbooks</option>
            <option value="electronics">Electronics</option>
            <option value="furniture">Furniture</option>
            <option value="clothing">Clothing</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="condition">Condition</label>
          <select
            className="input w-full"
            id="condition"
            name="condition"
            value={form.condition}
            onChange={onChange}
            required
          >
            <option value="new">New</option>
            <option value="like-new">Like New</option>
            <option value="used">Used</option>
            <option value="worn">Worn</option>
          </select>
        </div>

        <div>
          <label htmlFor="description">Description (optional)</label>
          <textarea
            className="input w-full"
            id="description"
            name="description"
            value={form.description}
            onChange={onChange}
            rows="4"
          />
        </div>

        {id && (
          <div>
            <label htmlFor="status">Status</label>
            <select
              className="input w-full"
              id="status"
              name="status"
              value={form.status}
              onChange={onChange}
            >
              <option value="active">Active</option>
              <option value="sold">Sold</option>
            </select>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm" role="alert">
            {error}
          </div>
        )}

        <button className="btn" type="submit">
          Save
        </button>
      </form>
    </div>
  )
}
