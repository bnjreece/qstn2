import { Container, Flex, Heading, Section, Text } from "@radix-ui/themes";

export const meta = () => {
  return [
    { title: "Hello World - Remix App" },
    { name: "description", content: "Welcome to my Remix application" },
  ];
};

export default function Index() {
  return (
    <Section 
      size="3" 
      style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center",
        justifyContent: "center",
        background: "var(--gray-1)"
      }}
    >
      <Container size="2">
        <Flex direction="column" align="center" gap="6">
          <Heading 
            size="9" 
            align="center" 
            style={{ 
              color: "var(--blue-9)",
              fontWeight: "bold"
            }}
          >
            Hello World 2
          </Heading>
          <Text 
            size="5" 
            align="center" 
            style={{ 
              color: "var(--slate-11)",
              maxWidth: "500px"
            }}
          >
            Welcome to my Remix application with Radix UI
          </Text>
        </Flex>
      </Container>
    </Section>
  );
} 