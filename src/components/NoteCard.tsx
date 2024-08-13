import React, { useRef } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
  Button,
  Flex,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
  Box,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { FilePenIcon, TrashIcon } from "./Icons";
import { Note } from "../types/note";
import { useMutation } from "@apollo/client";
import { GET_NOTES, DELETE_NOTE } from "../types/noteQueries";

interface NoteCardProps {
  note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [deleteNote] = useMutation(DELETE_NOTE, {
    refetchQueries: [{ query: GET_NOTES }],
  });

  const cancelRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const toast = useToast();

  const handleDelete = async () => {
    try {
      await deleteNote({
        variables: {
          id: note.id,
        },
      });
      onDeleteClose();
      toast({
        render: () => (
          <Box
            bg="#d5b990"
            color="white"
            p={3}
            borderRadius="md"
            boxShadow="md"
          >
            <Heading size="sm">Note deleted.</Heading>
            <Box mt={2}>The note has been successfully deleted.</Box>
          </Box>
        ),
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "Error deleting note.",
        description: "There was an error deleting the note.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/notes/edit/${note.id}`);
  };

  return (
    <>
      <Card
        variant="outline"
        borderWidth={1}
        borderColor="#c7a26b"
        borderRadius="md"
        overflow="hidden"
        cursor="pointer"
        bg="#e6d5bc"
        _hover={{ bg: "#d4c3aa" }}
        transition="background-color 0.3s"
        display="flex"
        flexDirection="column"
        height="250px"
        onClick={() => router.push(`/notes/${note.id}`)}
      >
        <CardHeader>
          <Heading noOfLines={1} size="md">
            {note.title}
          </Heading>
        </CardHeader>
        <CardBody flex="1">
          <Text noOfLines={3} color="#5c4523">
            {note.body}
          </Text>
        </CardBody>
        <CardFooter
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text fontSize="sm" color="#5c4523">
            {format(new Date(note.createdAt), "MMM d, yyyy h:mm a")}
          </Text>
          <Flex gap={1}>
            <Button
              variant="ghost"
              size="sm"
              _hover={{ bg: "#bc965c" }}
              onClick={handleEditClick}
            >
              <FilePenIcon />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              _hover={{ bg: "#bc965c" }}
              onClick={(e) => {
                e.stopPropagation();
                onDeleteOpen();
              }}
            >
              <TrashIcon />
            </Button>
          </Flex>
        </CardFooter>
      </Card>
      <AlertDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        leastDestructiveRef={cancelRef}
        isCentered
      >
        <AlertDialogOverlay bg="hsla(36, 39%, 88%, 0.8)" />
        <AlertDialogContent
          bg="#ece3d4"
          border="1px"
          borderColor="#c7a26b"
          w="100%"
          maxWidth="512px"
        >
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Hapus Catatan
          </AlertDialogHeader>
          <AlertDialogBody>
            Apakah Anda yakin ingin menghapus catatan ini? Tindakan ini tidak
            dapat dibatalkan.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              mr={3}
              variant="outline"
              fontWeight="light"
              borderColor="#bc965c"
              bgColor="#ECE3D4"
              _hover={{ bg: "#D89F4B" }}
              onClick={onDeleteClose}
              ref={cancelRef}
            >
              Batal
            </Button>
            <Button
              onClick={handleDelete}
              fontWeight="light"
              bgColor="#d5b990"
              _hover={{ bg: "#e3d1b5" }}
            >
              Hapus
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
