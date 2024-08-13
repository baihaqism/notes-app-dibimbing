import { GetServerSideProps, GetServerSidePropsContext } from "next";
import client from "../../api/graphql";
import { format } from "date-fns";
import {
  Heading,
  Text,
  Button,
  Flex,
  Box,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
} from "@chakra-ui/react";
import { Note } from "../../types/note";
import { FilePenIcon, TrashIcon } from "../../components/Icons";
import Header from "../../components/Header";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/client";
import { GET_NOTES, GET_NOTE_ID, DELETE_NOTE } from "../../types/noteQueries";
import React, { useEffect } from "react";

interface NotePageProps {
  note: Note;
}

const NotePage = ({ note: initialNote }: NotePageProps) => {
  const router = useRouter();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [deleteNote] = useMutation(DELETE_NOTE, {
    refetchQueries: [{ query: GET_NOTES }],
    awaitRefetchQueries: true,
  });
  const toast = useToast();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const { data, refetch } = useQuery(GET_NOTE_ID, {
    variables: { id: router.query.id as string },
    skip: !router.query.id,
    onCompleted: () => {
      if (data?.note) {
        refetch();
      }
    },
  });

  const note = data?.note || initialNote;

  useEffect(() => {
    refetch();
  }, [router.query.id, refetch]);

  const handleDelete = async () => {
    try {
      await deleteNote({
        variables: { id: note.id },
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
      router.push("/");
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

  return (
    <>
      <Header />
      <Box maxW="2xl" mx="auto" px={4} py={8}>
        <Heading as="h1" size="lg" mb={4}>
          Detail Catatan
        </Heading>
        <Box
          maxW="2xl"
          mx="auto"
          px={4}
          py={8}
          boxShadow="lg"
          border="1px"
          borderColor="#e2e8f0"
        >
          <Heading size="lg" mb={3}>
            {note.title}
          </Heading>
          <Text mb={3}>{note.body}</Text>
          <Flex
            direction="row"
            justify="space-between"
            align="center"
            borderTop="1px solid #e2e8f0"
            pt={4}
          >
            <Text fontSize="sm" color="#5c4523">
              {format(new Date(note.createdAt), "MMM d, yyyy h:mm a")}
            </Text>
            <Flex>
              <Button
                variant="ghost"
                size="sm"
                _hover={{ bg: "#bc965c" }}
                onClick={() => router.push(`/notes/edit/${note.id}`)}
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
          </Flex>
        </Box>
      </Box>
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
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { id } = context.query;

  try {
    const { data } = await client.query({
      query: GET_NOTE_ID,
      variables: { id: id as string },
    });

    return {
      props: {
        note: data.note,
      },
    };
  } catch (error) {
    console.error("Error fetching note:", error);
    return {
      notFound: true,
    };
  }
};

export default NotePage;
