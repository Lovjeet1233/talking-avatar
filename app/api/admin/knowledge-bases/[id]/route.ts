import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import KnowledgeBase from '@/lib/db/models/KnowledgeBase';
import { requireAdmin } from '@/lib/auth/adminMiddleware';

// PUT update knowledge base (admin can edit any user's KB)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request);
    await connectDB();
    
    const body = await request.json();
    const { name, welcomeMessage, prompt } = body;
    
    // Validation
    if (!name || !welcomeMessage || !prompt) {
      return NextResponse.json(
        { success: false, message: 'Name, welcome message, and prompt are required' },
        { status: 400 }
      );
    }
    
    const knowledgeBase = await KnowledgeBase.findById(params.id);
    
    if (!knowledgeBase) {
      return NextResponse.json(
        { success: false, message: 'Knowledge base not found' },
        { status: 404 }
      );
    }
    
    // Update knowledge base
    knowledgeBase.name = name;
    knowledgeBase.welcomeMessage = welcomeMessage;
    knowledgeBase.prompt = prompt;
    knowledgeBase.updatedAt = new Date();
    await knowledgeBase.save();
    
    return NextResponse.json({
      success: true,
      message: 'Knowledge base updated successfully',
      knowledgeBase: {
        id: String(knowledgeBase._id),
        name: knowledgeBase.name,
        welcomeMessage: knowledgeBase.welcomeMessage,
        prompt: knowledgeBase.prompt,
        updatedAt: knowledgeBase.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update knowledge base error:', error);
    
    if (error instanceof Error && error.message === 'Admin access required') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE knowledge base
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request);
    await connectDB();
    
    const knowledgeBase = await KnowledgeBase.findById(params.id);
    
    if (!knowledgeBase) {
      return NextResponse.json(
        { success: false, message: 'Knowledge base not found' },
        { status: 404 }
      );
    }
    
    await KnowledgeBase.findByIdAndDelete(params.id);
    
    return NextResponse.json({
      success: true,
      message: 'Knowledge base deleted successfully',
    });
  } catch (error) {
    console.error('Delete knowledge base error:', error);
    
    if (error instanceof Error && error.message === 'Admin access required') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

