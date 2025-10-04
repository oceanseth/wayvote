import { useState } from 'react'
import './ApiTest.css'

const ApiTest = () => {
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [testData, setTestData] = useState('{"message": "Hello from frontend!"}')

  const testHelloWorld = async () => {
    setLoading(true)
    setResponse('')
    
    try {
      const response = await fetch('/api/helloworld', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: testData
      })
      
      const data = await response.json()
      setResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      setResponse(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testApiRoot = async () => {
    setLoading(true)
    setResponse('')
    
    try {
      const response = await fetch('/api/')
      const data = await response.json()
      setResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      setResponse(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const clearResponse = () => {
    setResponse('')
  }

  return (
    <div className="api-test">
      <div className="container">
        <h1>API Testing</h1>
        <p>Test the WayVote API endpoints to ensure everything is working correctly.</p>
        
        <div className="test-section">
          <h2>Test Data</h2>
          <div className="form-group">
            <label htmlFor="testData" className="form-label">
              JSON Data to Send (for POST requests):
            </label>
            <textarea
              id="testData"
              className="form-control"
              rows="4"
              value={testData}
              onChange={(e) => setTestData(e.target.value)}
              placeholder='{"message": "Hello from frontend!"}'
            />
          </div>
        </div>

        <div className="test-section">
          <h2>API Endpoints</h2>
          <div className="button-group">
            <button
              className="test-button"
              onClick={testApiRoot}
              disabled={loading}
            >
              {loading ? <span className="spinner"></span> : 'Test API Root'}
            </button>
            <button
              className="test-button"
              onClick={testHelloWorld}
              disabled={loading}
            >
              {loading ? <span className="spinner"></span> : 'Test Hello World'}
            </button>
            <button
              className="test-button secondary"
              onClick={clearResponse}
              disabled={loading}
            >
              Clear Response
            </button>
          </div>
        </div>

        {response && (
          <div className="test-section">
            <h2>Response</h2>
            <div className="response-box">
              {response}
            </div>
          </div>
        )}

        <div className="test-section">
          <h2>Available Endpoints</h2>
          <div className="endpoints-list">
            <div className="endpoint">
              <strong>GET /api/</strong>
              <p>Returns API information and available endpoints</p>
            </div>
            <div className="endpoint">
              <strong>POST /api/helloworld</strong>
              <p>Test endpoint that returns posted content with a hello world message</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApiTest
