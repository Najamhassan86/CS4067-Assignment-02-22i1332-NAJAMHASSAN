import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const BookingPage = () => {
  const [tickets, setTickets] = useState(1);
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [eventTitle, setEventTitle] = useState('Loading...');
  const [cardInfo, setCardInfo] = useState({ cardNumber: '', expiry: '', cvv: '' });
  const navigate = useNavigate();
  const { eventId } = useParams();
  const userId = localStorage.getItem('userId') || 'user123';
  const userEmail = localStorage.getItem('userEmail') || 'user@example.com';

  useEffect(() => {
    const fetchEventTitle = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/events/${eventId}`);
        const title = response.data.title || 'Unknown Event';
        setEventTitle(title);
        localStorage.setItem(`eventTitle_${eventId}`, title);
      } catch (error) {
        console.error('Error fetching event title:', error);
        setEventTitle('Unknown Event');
        localStorage.setItem(`eventTitle_${eventId}`, 'Unknown Event');
      }
    };
    fetchEventTitle();
  }, [eventId]);

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5002/bookings', { userId, eventId, tickets, cardInfo, userEmail });
      if (response.data.details) {
        setShowSuccess(true);
        setMessage(`Booking successful! Your tickets for "${eventTitle}" have been confirmed.`);
      }
      setTimeout(() => navigate('/events'), 3000);
    } catch (error) {
      console.error('Error creating booking:', error.response?.data || error.message);
      setMessage(`Error creating booking: ${error.response?.data?.message || error.message}`);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return value;
  };

  return (
    <PageContainer>
      <LogoSection>
        <Logo>EventBooking</Logo>
        <Subtitle>Enterprise Solutions</Subtitle>
      </LogoSection>

      <BookingCard>
        <CardHeader>
          <BackButton onClick={() => navigate('/events')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Events
          </BackButton>
          <Title>Booking Confirmation</Title>
        </CardHeader>

        <EventDetails>
          <EventName>{eventTitle}</EventName>
          <EventId>Event ID: {eventId}</EventId>
        </EventDetails>

        {!showSuccess ? (
          <Form onSubmit={handleBook}>
            <InputGroup>
              <Label>Number of Tickets</Label>
              <TicketControls>
                <TicketButton 
                  type="button" 
                  onClick={() => setTickets(Math.max(1, tickets - 1))}
                >−</TicketButton>
                <TicketInput 
                  type="number" 
                  min="1" 
                  value={tickets} 
                  onChange={(e) => setTickets(Math.max(1, parseInt(e.target.value) || 1))}
                  required
                />
                <TicketButton 
                  type="button" 
                  onClick={() => setTickets(tickets + 1)}
                >+</TicketButton>
              </TicketControls>
            </InputGroup>

            <Section>
              <SectionTitle>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
                Payment Details
              </SectionTitle>
              
              <InputGroup>
                <Label>Card Number</Label>
                <Input
                  type="text"
                  value={cardInfo.cardNumber}
                  onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: formatCardNumber(e.target.value) })}
                  placeholder="XXXX XXXX XXXX XXXX"
                  maxLength="19"
                  required
                />
              </InputGroup>
              
              <InputRow>
                <InputGroup>
                  <Label>Expiry Date</Label>
                  <Input
                    type="text"
                    value={cardInfo.expiry}
                    onChange={(e) => setCardInfo({ ...cardInfo, expiry: formatExpiry(e.target.value) })}
                    placeholder="MM/YY"
                    maxLength="5"
                    required
                  />
                </InputGroup>
                
                <InputGroup>
                  <Label>CVV</Label>
                  <Input
                    type="text"
                    value={cardInfo.cvv}
                    onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value.replace(/\D/g, '') })}
                    placeholder="XXX"
                    maxLength="3"
                    required
                  />
                </InputGroup>
              </InputRow>
            </Section>
            
            <Section>
              <SectionTitle>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
                Order Summary
              </SectionTitle>
              
              <SummaryItem>
                <span>Tickets ({tickets})</span>
                <span>${(tickets * 99).toFixed(2)}</span>
              </SummaryItem>
              <SummaryItem>
                <span>Service Fee</span>
                <span>${(tickets * 5.99).toFixed(2)}</span>
              </SummaryItem>
              <SummaryDivider />
              <SummaryTotal>
                <span>Total</span>
                <span>${((tickets * 99) + (tickets * 5.99)).toFixed(2)}</span>
              </SummaryTotal>
            </Section>
            
            <SubmitButton type="submit">
              Confirm Booking
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </SubmitButton>
          </Form>
        ) : (
          <SuccessMessage>
            <SuccessIcon>✓</SuccessIcon>
            <SuccessText>{message}</SuccessText>
            <SuccessDetails>
              <SuccessItem>
                <span>Event:</span>
                <span>{eventTitle}</span>
              </SuccessItem>
              <SuccessItem>
                <span>Tickets:</span>
                <span>{tickets}</span>
              </SuccessItem>
              <SuccessItem>
                <span>Status:</span>
                <span>Confirmed</span>
              </SuccessItem>
              <SuccessItem>
                <span>Email:</span>
                <span>{userEmail}</span>
              </SuccessItem>
            </SuccessDetails>
            <SuccessNote>Redirecting to events page in a few seconds...</SuccessNote>
          </SuccessMessage>
        )}
        
        {message && !showSuccess && <ErrorMessage>{message}</ErrorMessage>}
        
        <SecurityNote>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>Secure payment. Your card details are protected.</span>
        </SecurityNote>
      </BookingCard>
      
      <Footer>
        <FooterText>© 2025 EventBooking Enterprise Solutions. All rights reserved.</FooterText>
      </Footer>
    </PageContainer>
  );
};

// Styled components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ef 100%);
  padding: 30px 20px;
  font-family: 'Segoe UI', Arial, sans-serif;
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 25px;
`;

const Logo = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  color: #0056b3;
  margin: 0;
  letter-spacing: 0.5px;
`;

const Subtitle = styled.h2`
  font-size: 0.9rem;
  color: #5c6780;
  font-weight: 400;
  margin: 0;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const BookingCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 550px;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.6s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #5c6780;
  font-size: 0.9rem;
  padding: 8px 0;
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: #0056b3;
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(-3px);
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #2c3e50;
  font-weight: 600;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
`;

const EventDetails = styled.div`
  padding: 25px 30px;
  border-bottom: 1px solid #f0f0f0;
  text-align: center;
`;

const EventName = styled.h3`
  font-size: 1.4rem;
  color: #2c3e50;
  margin: 0 0 8px 0;
  font-weight: 600;
`;

const EventId = styled.p`
  font-size: 0.9rem;
  color: #7f8c8d;
  margin: 0;
`;

const Form = styled.form`
  padding: 25px 30px;
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SectionTitle = styled.h4`
  font-size: 1.1rem;
  color: #2c3e50;
  margin: 0 0 5px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    color: #0056b3;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #5c6780;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 12px 15px;
  font-size: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #0056b3;
    box-shadow: 0 0 0 3px rgba(0, 86, 179, 0.1);
  }
  
  &::placeholder {
    color: #bdc3c7;
  }
`;

const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
`;

const TicketControls = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
`;

const TicketButton = styled.button`
  background: #f8f9fa;
  border: none;
  padding: 0;
  width: 40px;
  height: 42px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #e9ecef;
  }
`;

const TicketInput = styled.input`
  width: 60px;
  border: none;
  text-align: center;
  font-size: 1rem;
  padding: 12px 5px;
  
  &:focus {
    outline: none;
  }
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  color: #5c6780;
  padding: 8px 0;
`;

const SummaryDivider = styled.div`
  height: 1px;
  background-color: #f0f0f0;
  margin: 8px 0;
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  color: #2c3e50;
  font-weight: 600;
  padding: 8px 0;
`;

const SubmitButton = styled.button`
  background: linear-gradient(90deg, #0056b3 0%, #0073e6 100%);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover {
    background: linear-gradient(90deg, #004494 0%, #0066cc 100%);
    box-shadow: 0 4px 12px rgba(0, 86, 179, 0.3);
  }
  
  &:hover svg {
    transform: translateX(3px);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: all 0.6s;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 0.95rem;
  text-align: center;
  padding: 0 30px 25px;
  margin: -15px 0 0 0;
`;

const SuccessMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  animation: successFadeIn 0.6s ease-out;
  
  @keyframes successFadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const SuccessIcon = styled.div`
  width: 70px;
  height: 70px;
  background-color: #2ecc71;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(46, 204, 113, 0.3);
`;

const SuccessText = styled.h3`
  font-size: 1.4rem;
  color: #2c3e50;
  text-align: center;
  margin: 0 0 20px 0;
`;

const SuccessDetails = styled.div`
  width: 100%;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const SuccessItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eaeaea;
  
  &:last-child {
    border-bottom: none;
  }
  
  span:first-child {
    font-weight: 500;
    color: #5c6780;
  }
  
  span:last-child {
    font-weight: 600;
    color: #2c3e50;
  }
`;

const SuccessNote = styled.p`
  color: #7f8c8d;
  font-size: 0.9rem;
  text-align: center;
  margin: 0;
`;

const SecurityNote = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 15px 30px 25px;
  color: #7f8c8d;
  font-size: 0.85rem;
  
  svg {
    color: #0056b3;
  }
`;

const Footer = styled.footer`
  margin-top: 40px;
  text-align: center;
`;

const FooterText = styled.p`
  color: #8795a1;
  font-size: 0.8rem;
`;

export default BookingPage;