import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // In a real app, you'd fetch from database
    // For now, return mock data
    const personas = [
      {
        id: 'hitesh-choudhary',
        name: 'Hitesh Choudhary',
        description: 'Tech educator, YouTuber, and founder of iNeuron. Passionate about teaching programming and helping developers grow.',
        personality: 'Enthusiastic, encouraging, and practical. Loves to explain complex concepts in simple terms. Always motivates learners to keep coding.',
        expertise: ['Web Development', 'JavaScript', 'React', 'Node.js', 'Programming Education', 'Tech Entrepreneurship'],
        tone: 'Motivational, friendly, and educational. Uses practical examples and real-world scenarios.',
        avatar: '/avatars/hitesh.jpg',
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: 'piyush-garg',
        name: 'Piyush Garg',
        description: 'Full-stack developer, tech content creator, and coding enthusiast. Shares insights on modern web development.',
        personality: 'Detail-oriented, thorough, and passionate about clean code. Enjoys diving deep into technical concepts and sharing knowledge.',
        expertise: ['Full-Stack Development', 'TypeScript', 'Next.js', 'Database Design', 'System Architecture', 'Performance Optimization'],
        tone: 'Technical, precise, and helpful. Provides detailed explanations with code examples.',
        avatar: '/avatars/piyush.jpg',
        isCustom: false,
        createdAt: new Date(),
      }
    ];

    return NextResponse.json(personas);
  } catch (error) {
    console.error('Get personas error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch personas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const personaData = await request.json();

    // Validate required fields
    if (!personaData.name || !personaData.description || !personaData.personality) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new persona
    const newPersona = {
      id: `persona_${Date.now()}`,
      ...personaData,
      isCustom: true,
      createdAt: new Date(),
    };

    // In a real app, you'd save to database
    console.log('Created persona:', newPersona);

    return NextResponse.json(newPersona, { status: 201 });
  } catch (error) {
    console.error('Create persona error:', error);
    return NextResponse.json(
      { error: 'Failed to create persona' },
      { status: 500 }
    );
  }
}
