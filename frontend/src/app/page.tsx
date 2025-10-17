'use client';

import { SignInButton, SignOutButton, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();

  // Ensure the body has the dark background/light text from globals.css
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem', backgroundColor: '#1c1c24', color: '#f4f4f5' }}>
      
      {/* Header/Auth Status */}
      <div style={{ position: 'absolute', top: 0, width: '100%', padding: '1rem', borderBottom: '1px solid #343440', backgroundColor: '#1c1c24', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontWeight: 'bold' }}>ResQ-Her: A Silent Shield</p>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {isLoaded ? (
            isSignedIn ? (
              <>
                <p style={{ marginRight: '1rem', fontSize: '0.9rem' }}>Welcome, {user.firstName || user.emailAddresses[0].emailAddress}!</p>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <SignInButton mode="modal">
                <button style={{ 
                    backgroundColor: '#703091', 
                    color: 'white', 
                    padding: '8px 16px', 
                    borderRadius: '6px', 
                    cursor: 'pointer' 
                  }}>
                  Sign In / Sign Up
                </button>
              </SignInButton>
            )
          ) : (
            <p style={{ color: '#aaa' }}>Loading user...</p>
          )}
        </div>
      </div>

      {/* Main App Navigation - Clean, Simple List Structure */}
      <div style={{ marginTop: '5rem', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* SOS Card */}
        <Link href="/sos" style={{ display: 'block', border: '1px solid #cc0000', padding: '1rem', borderRadius: '8px', backgroundColor: '#2a2a35' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#cc0000', marginBottom: '0.5rem' }}>
            SOS & Alert →
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#ccc' }}>
            Activate a discreet alert, share your live location, and get instant help.
          </p>
        </Link>

        {/* Law Bot Card */}
        <Link href="/law-bot" style={{ display: 'block', border: '1px solid #703091', padding: '1rem', borderRadius: '8px', backgroundColor: '#2a2a35' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#703091', marginBottom: '0.5rem' }}>
            Law Bot →
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#ccc' }}>
            Ask confidential questions about legal rights using our RAG AI knowledge base.
          </p>
        </Link>

        {/* Therapy Bot Card */}
        <Link href="/therapy-bot" style={{ display: 'block', border: '1px solid #703091', padding: '1rem', borderRadius: '8px', backgroundColor: '#2a2a35' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#703091', marginBottom: '0.5rem' }}>
            Therapy Bot →
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#ccc' }}>
            Access 24/7 confidential mental health support and coping strategies.
          </p>
        </Link>

      </div>
    </main>
  );
}