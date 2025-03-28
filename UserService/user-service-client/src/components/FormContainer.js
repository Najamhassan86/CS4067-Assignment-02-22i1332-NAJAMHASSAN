import React, { useState, useRef } from 'react';
import Register from './Register';
import Login from './Login';
import styled from 'styled-components';

const FormContainer = () => {
  const [showRegister, setShowRegister] = useState(true);
  const formRef = useRef();

  const toggleForm = () => {
    setShowRegister((prev) => !prev);
  };

  return (
    <Container>
      <LogoSection>
        <Logo>EventBooking</Logo>
        <Subtitle>Enterprise Solutions</Subtitle>
      </LogoSection>
      
      <CardContainer>
        <Title>Welcome to User Management Portal</Title>
        <Description>
          Access your account or create a new one to manage your event bookings.
        </Description>
        
        <ToggleButtonContainer>
          <ToggleButton 
            active={showRegister} 
            onClick={() => setShowRegister(true)}
          >
            Register
          </ToggleButton>
          <ToggleButton 
            active={!showRegister} 
            onClick={() => setShowRegister(false)}
          >
            Login
          </ToggleButton>
        </ToggleButtonContainer>

        <FormWrapper ref={formRef}>
          {showRegister ? (
            <Form>
              <Register />
            </Form>
          ) : (
            <Form>
              <Login />
            </Form>
          )}
        </FormWrapper>
        
        <SecurityNote>
          <SecurityIcon>🔒</SecurityIcon>
          <SecurityText>Secure authentication. Your data is protected.</SecurityText>
        </SecurityNote>
      </CardContainer>
      
      <Footer>
        <FooterText>© 2025 EventBooking Enterprise Solutions. All rights reserved.</FooterText>
      </Footer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ef 100%);
  padding: 20px;
  font-family: 'Segoe UI', Arial, sans-serif;
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const Logo = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #0056b3;
  margin: 0;
  letter-spacing: 0.5px;
`;

const Subtitle = styled.h2`
  font-size: 1rem;
  color: #5c6780;
  font-weight: 400;
  margin: 0;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const CardContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 15px;
  text-align: center;
  font-weight: 600;
`;

const Description = styled.p`
  font-size: 0.95rem;
  color: #7f8c9d;
  margin-bottom: 30px;
  text-align: center;
  line-height: 1.5;
`;

const ToggleButtonContainer = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 30px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: 12px 20px;
  font-size: 1rem;
  border: none;
  background-color: ${props => props.active ? '#0056b3' : 'white'};
  color: ${props => props.active ? 'white' : '#555'};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${props => props.active ? '600' : '400'};
  
  &:hover {
    background-color: ${props => props.active ? '#004494' : '#f5f5f5'};
  }
`;

const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  transition: all 0.5s ease;
`;

const Form = styled.div`
  width: 100%;
  transition: opacity 0.5s ease;
`;

const SecurityNote = styled.div`
  display: flex;
  align-items: center;
  margin-top: 25px;
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
  width: 100%;
`;

const SecurityIcon = styled.span`
  font-size: 1.2rem;
  margin-right: 10px;
`;

const SecurityText = styled.span`
  font-size: 0.8rem;
  color: #6c757d;
`;

const Footer = styled.footer`
  margin-top: 40px;
  text-align: center;
`;

const FooterText = styled.p`
  color: #8795a1;
  font-size: 0.8rem;
`;

export default FormContainer;