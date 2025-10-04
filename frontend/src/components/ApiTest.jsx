import { useState } from 'react'
import './ApiTest.css'

const API_BASE_URL = 'https://api.wayvote.org'

const ApiTest = () => {
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [testData, setTestData] = useState('{"message": "Hello from frontend!"}')
  const [contentId, setContentId] = useState('content1')
  const [rankingData, setRankingData] = useState(JSON.stringify({
    "ids": ["content1", "content2", "content3"],
    "customRanking": [
      {
        "weighName": "IQ",
        "weighValue": 10
      },
      {
        "weighName": "Experience",
        "weighValue": 5
      }
    ]
  }, null, 2))

  const testApiRoot = async () => {
    setLoading(true)
    setResponse('')
    
    try {
      const response = await fetch(`${API_BASE_URL}/`)
      const data = await response.json()
      setResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      setResponse(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testHelloWorld = async () => {
    setLoading(true)
    setResponse('')
    
    try {
      const response = await fetch(`${API_BASE_URL}/helloworld`, {
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

  const testGetRankings = async () => {
    setLoading(true)
    setResponse('')
    
    try {
      const response = await fetch(`${API_BASE_URL}/getRankings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: rankingData
      })
      
      const data = await response.json()
      setResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      setResponse(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testUpVote = async () => {
    setLoading(true)
    setResponse('')
    
    try {
      const response = await fetch(`${API_BASE_URL}/upVote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contentId })
      })
      
      const data = await response.json()
      setResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      setResponse(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testDownVote = async () => {
    setLoading(true)
    setResponse('')
    
    try {
      const response = await fetch(`${API_BASE_URL}/downVote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contentId })
      })
      
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
        <p><strong>API Base URL:</strong> <code>{API_BASE_URL}</code></p>
        
        <div className="test-section">
          <h2>Test Data</h2>
          <div className="form-group">
            <label htmlFor="testData" className="form-label">
              JSON Data for Hello World:
            </label>
            <textarea
              id="testData"
              className="form-control"
              rows="3"
              value={testData}
              onChange={(e) => setTestData(e.target.value)}
              placeholder='{"message": "Hello from frontend!"}'
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="contentId" className="form-label">
              Content ID for Voting:
            </label>
            <input
              id="contentId"
              type="text"
              className="form-control"
              value={contentId}
              onChange={(e) => setContentId(e.target.value)}
              placeholder="content1"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="rankingData" className="form-label">
              Ranking Data (Get Rankings):
            </label>
            <textarea
              id="rankingData"
              className="form-control"
              rows="8"
              value={rankingData}
              onChange={(e) => setRankingData(e.target.value)}
              placeholder='{"ids": ["content1", "content2"], "customRanking": [{"weighName": "IQ", "weighValue": 10}]}'
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
              className="test-button"
              onClick={testGetRankings}
              disabled={loading}
            >
              {loading ? <span className="spinner"></span> : 'Test Get Rankings'}
            </button>
            <button
              className="test-button"
              onClick={testUpVote}
              disabled={loading}
            >
              {loading ? <span className="spinner"></span> : 'Test Upvote'}
            </button>
            <button
              className="test-button"
              onClick={testDownVote}
              disabled={loading}
            >
              {loading ? <span className="spinner"></span> : 'Test Downvote'}
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
              <strong>GET /</strong>
              <p>Returns API information and available endpoints</p>
            </div>
            <div className="endpoint">
              <strong>POST /helloworld</strong>
              <p>Test endpoint that returns posted content with a hello world message</p>
            </div>
            <div className="endpoint">
              <strong>POST /getRankings</strong>
              <p>Get content rankings based on custom criteria. Requires ids array and customRanking array.</p>
            </div>
            <div className="endpoint">
              <strong>POST /upVote</strong>
              <p>Upvote content. Requires contentId in request body.</p>
            </div>
            <div className="endpoint">
              <strong>POST /downVote</strong>
              <p>Downvote content. Requires contentId in request body.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApiTest
