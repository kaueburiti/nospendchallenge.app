// @ts-nocheck

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface WelcomeEmailProps {
  verificationUrl: string;
}

export const WelcomeEmail = ({ verificationUrl }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>
      Welcome to #NoSpendChallenge - Start Your Savings Journey!
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Text style={logo}>#NoSpendChallenge</Text>
        </Section>

        <Heading style={h1}>Welcome to #NoSpendChallenge! 🎉</Heading>

        <Text style={text}>
          We're thrilled to have you join our community of mindful spenders. Get
          ready to transform your relationship with money and achieve your
          financial goals.
        </Text>

        {/* <Section style={buttonSection}>
          <Button href={verificationUrl} style={button}>
            Verify Your Email
          </Button>
        </Section> */}

        <Text style={text}>Here's what you can do next:</Text>

        <Text style={listItem}>• Set up your first #NoSpendChallenge</Text>
        <Text style={listItem}>• Connect with like-minded savers</Text>
        <Text style={listItem}>
          • Track your progress and celebrate milestones
        </Text>

        <Text style={text}>
          If you have any questions or need help getting started, don't hesitate
          to reach out to me at debora@nospendchallenge.app!
        </Text>

        <Text style={footer}>
          Happy Saving!
          <br />
          Débora Buriti from #NoSpendChallenge
        </Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};

const logoSection = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const logo = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#ff7979',
};

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const text = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const listItem = {
  ...text,
  margin: '8px 0',
  paddingLeft: '16px',
};

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#ff7979',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  marginTop: '32px',
};
