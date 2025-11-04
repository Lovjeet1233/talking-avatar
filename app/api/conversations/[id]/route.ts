import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Conversation from '@/lib/db/models/Conversation';
import Message from '@/lib/db/models/Message';
import { requireAuth } from '@/lib/auth/middleware';

// GET single conversation with messages
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAuth(request);
    await connectDB();
    
    const { id } = await params;
    
    const conversation = await Conversation.findOne({
      _id: id,
      userId: user.userId,
    }).populate('knowledgeBaseId');
    
    if (!conversation) {
      return NextResponse.json(
        { success: false, message: 'Conversation not found' },
        { status: 404 }
      );
    }
    
    const messages = await Message.find({ conversationId: id })
      .sort({ timestamp: 1 });
    
    // Handle cases where knowledgeBaseId might be null or deleted
    const knowledgeBase = conversation.knowledgeBaseId ? {
      id: (conversation.knowledgeBaseId as any)._id.toString(),
      name: (conversation.knowledgeBaseId as any).name,
      welcomeMessage: (conversation.knowledgeBaseId as any).welcomeMessage,
      prompt: (conversation.knowledgeBaseId as any).prompt,
    } : {
      id: '',
      name: 'Deleted Knowledge Base',
      welcomeMessage: '',
      prompt: '',
    };
    
    return NextResponse.json({
      success: true,
      conversation: {
        id: conversation._id.toString(),
        title: conversation.title,
        avatarId: conversation.avatarId,
        voiceId: conversation.voiceId,
        language: conversation.language,
        knowledgeBase,
        status: conversation.status,
        createdAt: conversation.createdAt,
        lastMessageAt: conversation.lastMessageAt,
        messages: messages.map(msg => ({
          id: msg._id.toString(),
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
        })),
      },
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

