#!/usr/bin/env python3
"""
Test script to verify Google Gemini embeddings are working correctly.
"""

import os
import sys
import subprocess

def run_test():
    """Test Google Gemini embeddings with LlamaIndex."""
    print("🧪 Testing Google Gemini Embeddings Integration")
    print("=" * 60)
    
    try:
        # Test import
        print("1. Testing imports...")
        from llama_index.embeddings.google import GoogleEmbedding
        print("✅ GoogleEmbedding import successful")
        
        # Test embedding model creation
        print("\n2. Testing embedding model creation...")
        embed_model = GoogleEmbedding(model="gemini-embedding-001")
        print("✅ GoogleEmbedding model created successfully")
        print(f"   Model: {embed_model.model}")
        
        # Test embedding generation (simple test)
        print("\n3. Testing embedding generation...")
        test_text = "This is a test document for embedding generation."
        try:
            embeddings = embed_model.get_text_embedding(test_text)
            print(f"✅ Embedding generated successfully")
            print(f"   Dimension: {len(embeddings)}")
            print(f"   Sample values: {embeddings[:5]}...")
            
            # Verify dimension matches expected (768 for Gemini)
            if len(embeddings) == 768:
                print("✅ Embedding dimension matches expected (768)")
            else:
                print(f"⚠️  Unexpected embedding dimension: {len(embeddings)} (expected 768)")
                
        except Exception as e:
            print(f"❌ Embedding generation failed: {e}")
            print("💡 Make sure GOOGLE_API_KEY is set or you're authenticated with Google Cloud")
            return False
        
        # Test MongoDB integration setup
        print("\n4. Testing MongoDB integration setup...")
        try:
            from app.mongodb_agent.mongodb_llamaindex_tools import _get_mongodb_client
            client = _get_mongodb_client()
            if client:
                print("✅ MongoDB connection successful")
                client.close()
            else:
                print("❌ MongoDB connection failed")
                return False
        except Exception as e:
            print(f"❌ MongoDB integration test failed: {e}")
            return False
        
        print("\n" + "=" * 60)
        print("🎉 All tests passed! Google Gemini embeddings are working correctly.")
        print("\nNext steps:")
        print("• Run 'adk web' to start the agent")
        print("• Use semantic search and document storage features")
        print("• Embeddings will now use Google's gemini-embedding-001 model")
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("💡 Make sure llama-index-embeddings-google is installed")
        return False
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

if __name__ == "__main__":
    success = run_test()
    sys.exit(0 if success else 1)
