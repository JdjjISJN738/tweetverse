from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import tweets
from app.core.websocket import manager
from app.services.thought_engine import ThoughtEngine
from app.services.stream import TwitterStream
import asyncio

def create_app() -> FastAPI:
    app = FastAPI(
        title="TweetVerse API",
        description="Real-Time Viral Trends & Sentiment Intelligence Platform",
        version="1.0.0"
    )

    # Enable CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Global Engine & Stream Instances
    thought_engine = ThoughtEngine()
    twitter_stream = TwitterStream(thought_engine, manager)
    
    app.state.thought_engine = thought_engine # Make accessible to routes
    app.state.twitter_stream = twitter_stream

    # Include Routers
    app.include_router(tweets.router, prefix="/api", tags=["Tweets"])

    @app.get("/", tags=["Root"])
    async def root():
        return {
            "message": "Welcome to TweetVerse API",
            "docs": "/docs",
            "status": "operational"
        }

    @app.websocket("/ws")
    async def websocket_endpoint(websocket: WebSocket):
        await manager.connect(websocket)
        try:
            while True:
                # Keep connection alive
                await websocket.receive_text()
        except WebSocketDisconnect:
            manager.disconnect(websocket)

    @app.on_event("startup")
    async def startup_event():
        # Start the background ingestion task in a way that doesn't block startup
        async def run_stream():
            try:
                await app.state.twitter_stream.start_hybrid_ingestion()
            except Exception as e:
                print(f"[CRITICAL] Background Stream Error: {e}")

        app.state.twitter_stream.current_task = asyncio.create_task(run_stream())

    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
