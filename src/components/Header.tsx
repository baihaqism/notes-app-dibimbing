import Link from "next/link";
import { Flex, Button, Heading } from "@chakra-ui/react";
import { PlusIcon, StickyNoteIcon } from "./Icons";

export default function Header() {
  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      p={4}
      borderBottom="1px"
      borderColor="#bc965c"
      bg="#ece3d4"
    >
      <Link href="/" passHref>
        <Flex align="center" gap={2}>
          <StickyNoteIcon />
          <Heading as="h1" size="xl">
            Notes
          </Heading>
        </Flex>
      </Link>
      <Link href="/notes/new" passHref>
        <Button
          leftIcon={<PlusIcon />}
          bgColor="#d5b990"
          _hover={{ bg: "#e3d1b5" }}
          fontWeight="light"
          size="md"
        >
          New Note
        </Button>
      </Link>
    </Flex>
  );
}
