import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import {
  Container,
  Flex,
  Card,
  Heading,
  Text,
  Grid,
  Box,
  TextArea,
} from "@radix-ui/themes";
import { supabase } from "../utils/supabase.server";

interface LoaderData {
  message: string;
  error: string | null;
  details?: {
    code?: string;
    hint?: string;
    type?: string;
    stringified?: string;
    stack?: string;
    [key: string]: any;
  };
}

export async function loader() {
  return json<LoaderData>({ 
    message: 'Personal Plan',
    error: null 
  });
}

export default function Index() {
  const { message } = useLoaderData<typeof loader>();

  return (
    <Box p="6" style={{ minHeight: '100vh' }}>
      <Container size="3">
        <Flex direction="column" gap="6">
          {/* Header */}
          <Card size="4">
            <Flex justify="between" align="center" gap="4">
              <Heading size="8" mb="1">Personal Plan</Heading>
              <Text size="2" color="gray">Last Updated: {new Date().toLocaleDateString()}</Text>
            </Flex>
          </Card>

          {/* Core Values Section */}
          <Card size="4">
            <Heading size="4" mb="3">Core Values</Heading>
            <Text size="2" color="gray" mb="4">(Fill in up to 5 of your strongest core values)</Text>
            <Grid columns="5" gap="3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Box key={i}>
                  <input 
                    placeholder={`Value ${i}`}
                    className="rt-TextFieldInput rt-r-size-2"
                    style={{ width: '100%' }}
                  />
                </Box>
              ))}
            </Grid>
          </Card>

          {/* Time Frame Sections */}
          <Card size="4">
            <Heading size="4" mb="4">Long-term Aspirations (10-25 years)</Heading>
            <Grid columns="4" gap="4">
              {/* Relationships */}
              <Box>
                <Heading size="3" mb="2">Relationships</Heading>
                <TextArea placeholder="Your relationship aspirations..." size="3" style={{ minHeight: '120px' }} />
              </Box>

              {/* Achievements */}
              <Box>
                <Heading size="3" mb="2">Achievements</Heading>
                <TextArea placeholder="Your achievement aspirations..." size="3" style={{ minHeight: '120px' }} />
              </Box>

              {/* Rituals */}
              <Box>
                <Heading size="3" mb="2">Rituals</Heading>
                <TextArea placeholder="Your ritual aspirations..." size="3" style={{ minHeight: '120px' }} />
              </Box>

              {/* Wealth */}
              <Box>
                <Heading size="3" mb="2">Wealth (Experiences)</Heading>
                <TextArea placeholder="Your wealth/experience aspirations..." size="3" style={{ minHeight: '120px' }} />
              </Box>
            </Grid>
          </Card>

          {/* 1 Year Activities */}
          <Card size="4">
            <Heading size="4" mb="2">1 Year Activities</Heading>
            <Text size="2" color="gray" mb="4">(5 or less)</Text>
            <Flex direction="column" gap="3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Box key={i}>
                  <input 
                    placeholder={`Activity ${i}`}
                    className="rt-TextFieldInput rt-r-size-2"
                    style={{ width: '100%' }}
                  />
                </Box>
              ))}
            </Flex>
          </Card>

          {/* 90 Day Activities */}
          <Grid columns="2" gap="4">
            {/* START Activities */}
            <Card size="4">
              <Heading size="4" mb="2">90 Day Activities - START</Heading>
              <Text size="2" color="gray" mb="4">(5 or less)</Text>
              <Flex direction="column" gap="3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Box key={i}>
                    <input 
                      placeholder={`Start Activity ${i}`}
                      className="rt-TextFieldInput rt-r-size-2"
                      style={{ width: '100%' }}
                    />
                  </Box>
                ))}
              </Flex>
            </Card>

            {/* STOP Activities */}
            <Card size="4">
              <Heading size="4" mb="2">90 Day Activities - STOP</Heading>
              <Text size="2" color="gray" mb="4">(5 or less)</Text>
              <Flex direction="column" gap="3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Box key={i}>
                    <input 
                      placeholder={`Stop Activity ${i}`}
                      className="rt-TextFieldInput rt-r-size-2"
                      style={{ width: '100%' }}
                    />
                  </Box>
                ))}
              </Flex>
            </Card>
          </Grid>
        </Flex>
      </Container>
    </Box>
  );
} 