import { useEffect, useState } from 'react'
import Dictation from './Dictation'

const API_BASE_URL = '/api'

function TNPlus() {
  const [vocabList, setVocabList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTNPlus = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`${API_BASE_URL}/Vocabularies/tn-plus`)
        if (!response.ok) {
          throw new Error(`Failed to load TN+ (${response.status})`)
        }
        const result = await response.json()
        const list = Array.isArray(result) ? result : []
        setVocabList(list)
      } catch (err) {
        setError(err.message)
        setVocabList([])
      } finally {
        setLoading(false)
      }
    }

    fetchTNPlus()
  }, [])

  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{ textAlign: 'center' }}>Dictation TN+</h1>
      {loading && <div style={{ textAlign: 'center' }}>Loading...</div>}
      {error && <div style={{ textAlign: 'center' }}>Error: {error}</div>}
      {!loading && !error && <Dictation vocabList={vocabList} />}
    </div>
  )
}

export default TNPlus
