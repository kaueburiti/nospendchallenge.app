import React from 'react';
import { ScrollView } from '@/components/ui/scroll-view';
import { Box, Heading, Text, VStack } from '@/components/ui';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import BackButton from '@/components/navigation/back-button';

export default function PrivacyPolicy() {
  return (
    <SafeAreaView>
      <ScrollView className="flex-1">
        <Box className="px-4 pb-16 pt-8">
          <BackButton />
          <VStack space="xs" className="mb-8">
            <Heading size="sm">#NoSpendChallenge</Heading>
            <Heading size="2xl">Terms of Service</Heading>
            <Text className="text-muted-foreground text-sm">
              Last Updated: March 8, 2022
            </Text>
          </VStack>

          <VStack space="xl">
            <VStack space="4xl">
              <Box>
                <Heading size="lg" className="mb-2">
                  Introduction
                </Heading>
                <Text>
                  Welcome to the #NoSpendChallenge App (&quot;we,&quot;
                  &quot;our,&quot; or &quot;us&quot;). Your privacy is important
                  to us. This Privacy Policy outlines the types of information
                  we collect, how we use and share that information, and your
                  privacy rights.
                </Text>
              </Box>

              <Box>
                <Heading size="lg" className="mb-2">
                  Information We Collect
                </Heading>
                <Text>
                  The personal information we collect includes your email, name,
                  and profile picture. We also collect non-personal data, which
                  includes challenge data.
                </Text>
              </Box>

              <Box>
                <Heading size="lg" className="mb-2">
                  How We Use Your Information
                </Heading>
                <Text>
                  We use your information to provide, maintain, and improve our
                  services, communicate with you, personalize your experience,
                  and promote safety and security. We may also use your
                  information for research, analysis, and promotional purposes.
                </Text>
              </Box>

              <Box>
                <Heading size="lg" className="mb-2">
                  Data Sharing and Third-Party Services
                </Heading>
                <Text>
                  We reserve the right to share your personal data with our
                  commercial partners. Any data shared will be in accordance
                  with this Privacy Policy and the relevant privacy laws.
                </Text>
              </Box>

              <Box>
                <Heading size="lg" className="mb-2">
                  Your Privacy Rights
                </Heading>
                <Text>
                  Depending on your location, you may have certain rights with
                  respect to your personal information, including the right to
                  access, correct, or delete your personal information, and to
                  object to or limit our processing of your personal
                  information.
                </Text>
              </Box>

              <Box>
                <Heading size="lg" className="mb-2">
                  Children's Privacy
                </Heading>
                <Text>
                  This app is not intended for children. If we become aware that
                  we have inadvertently collected personal information from
                  children, we will take steps to delete it as soon as possible.
                </Text>
              </Box>

              <Box>
                <Heading size="lg" className="mb-2">
                  Data Security
                </Heading>
                <Text>
                  We implement reasonable measures to protect your personal
                  information from unauthorized access, use, or disclosure.
                  However, the transmission of information via the internet is
                  not completely secure, and we cannot guarantee the security of
                  your personal information.
                </Text>
              </Box>

              <Box>
                <Heading size="lg" className="mb-2">
                  Changes to This Privacy Policy
                </Heading>
                <Text>
                  We may periodically update this Privacy Policy. Any changes
                  will be posted on this page with an updated "Last Updated"
                  date. Please check back regularly to stay informed about any
                  changes.
                </Text>
              </Box>

              <Box>
                <Heading size="lg" className="mb-2">
                  Governing Law
                </Heading>
                <Text>
                  This Privacy Policy shall be governed by and construed in
                  accordance with the laws of the United States.
                </Text>
              </Box>

              <Box>
                <Heading size="lg" className="mb-2">
                  Contact Us
                </Heading>
                <Text>
                  If you have any questions or concerns about this Privacy
                  Policy, you can contact us at debora@nospendchallenge.app.
                </Text>
              </Box>
            </VStack>
          </VStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
