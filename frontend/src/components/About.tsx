import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 100;
`;

const Logo = styled.a`
  display: block;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.8;
  }

  img {
    width: 160px;
    height: auto;
  }
`;

const AboutButton = styled.button`
  padding: 0.5rem 1rem;
  background: #1a1d23;
  color: #4CAF50;
  border: 2px solid #4CAF50;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
  
  &:hover {
    background: #4CAF50;
    color: white;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #1a1d23;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  color: #fff;
  line-height: 1.8;
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans Thai', 'Kanit', sans-serif;

  a {
    color: inherit;
    text-decoration: none;
    
    &:hover {
      opacity: 0.8;
    }

    img {
      margin: 0;
    }
  }

  img {
    margin: 1rem 0;
  }

  br {
    display: block;
    content: "";
    margin: 0.5rem 0;
  }

  /* Override any default styles from the markdown content */
  * {
    text-align: center !important;
  }

  /* Handle image container */
  p {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin: 0;
  }
`;

const LoadingSpinner = styled.div`
  color: #4CAF50;
  text-align: center;
  padding: 2rem;
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
  
  &:hover {
    color: #4CAF50;
  }
`;

interface Props {
  logoUrl: string;
  logoLink: string;
  readmeUrl: string;
}


interface GitHubResponse {
  content: string;
  encoding: string;
}

const decodeBase64 = (str: string): string => {
  const binaryString = window.atob(str);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new TextDecoder('utf-8').decode(bytes);
};

export const About: React.FC<Props> = ({ 
  logoUrl, 
  logoLink,
  readmeUrl = 'https://api.github.com/repos/natnon007/tetris-game/contents/README.md' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && !content) {
      const fetchReadme = async () => {
        setLoading(true);
        setError('');
        try {
          const response = await fetch(readmeUrl);
          if (!response.ok) {
            throw new Error('Failed to fetch README');
          }
          
          const data: GitHubResponse = await response.json();
          
          // Decode base64 content
          const decodedContent = decodeBase64(data.content.replace(/\n/g, ''));
          
          // Get only the About section (everything after the # About heading)
          const aboutSection = decodedContent.split('# About')[1];
          
          if (!aboutSection) {
            throw new Error('About section not found in README');
          }
          
          setContent(aboutSection);
        } catch (error) {
          console.error('Error fetching readme:', error);
          setError(error instanceof Error ? error.message : 'Failed to load content');
        } finally {
          setLoading(false);
        }
      };

      fetchReadme();
    }
  }, [isOpen, content, readmeUrl]);

  const createMarkup = () => {
    return { __html: content };
  };

  return (
    <>
      <HeaderContainer>
      <Logo href={logoLink} target="_blank" rel="noopener noreferrer">
          <img src={logoUrl} alt="Logo" />
        </Logo>
        <AboutButton onClick={() => setIsOpen(true)}>
          About
        </AboutButton>
      </HeaderContainer>

      {isOpen && (
        <ModalOverlay onClick={() => setIsOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={() => setIsOpen(false)}>×</CloseButton>
            {loading ? (
              <LoadingSpinner>Loading...</LoadingSpinner>
            ) : error ? (
              <ErrorMessage>{error}</ErrorMessage>
            ) : (
              <div dangerouslySetInnerHTML={createMarkup()} />
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};