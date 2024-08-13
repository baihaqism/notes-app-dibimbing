import { useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Heading,
} from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { GET_NOTES } from "../../types/noteQueries";
import {
  CREATE_NOTE,
  CreateNoteVars,
  CreateNoteData,
} from "../../types/noteQueries";
import Header from "../../components/Header";
import { Note } from "../../types/note";

const NewNotePage = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const [createNote] = useMutation<CreateNoteData, CreateNoteVars>(
    CREATE_NOTE,
    {
      update(cache, { data }) {
        if (!data) return;
        const { notes } = cache.readQuery<{ notes: Note[] }>({
          query: GET_NOTES,
        }) || { notes: [] };

        cache.writeQuery({
          query: GET_NOTES,
          data: {
            notes: [data.createNote, ...notes],
          },
        });
      },
    }
  );

  const handleSave = async () => {
    if (!title.trim() || !body.trim()) {
      toast({
        title: "Error",
        description: "Judul dan isi diperlukan",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createNote({
        variables: {
          title,
          body,
        },
      });
      toast({
        render: () => (
          <Box
            bg="#d5b990"
            color="white"
            p={3}
            borderRadius="md"
            boxShadow="md"
          >
            <Heading size="sm">Note created.</Heading>
            <Box mt={2}>Your note has been successfully created.</Box>
          </Box>
        ),
        duration: 3000,
        isClosable: true,
      });
      router.push("/");
    } catch (error) {
      console.error("Error creating note:", error);
      toast({
        title: "An error occurred.",
        description: "Unable to create the note.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main>
        <Box maxW="2xl" mx="auto" px={4} py={8}>
          <Heading as="h1" size="lg" mb={4}>
            Buat Catatan Baru
          </Heading>
          <Box
            as="form"
            onSubmit={(e: { preventDefault: () => void }) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <FormControl id="title" mb={4} borderColor="#c7a26b">
              <FormLabel>Judul</FormLabel>
              <Input
                focusBorderColor="#6F532A"
                placeholder="Masukkan judul catatan"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                isDisabled={isSubmitting}
              />
            </FormControl>
            <FormControl id="content" mb={4} borderColor="#c7a26b">
              <FormLabel>Isi</FormLabel>
              <Textarea
                focusBorderColor="#6F532A"
                placeholder="Masukkan isi catatan"
                rows={8}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                isDisabled={isSubmitting}
              />
            </FormControl>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="outline"
                fontWeight="light"
                borderColor="#bc965c"
                bgColor="#ece3d4"
                _hover={{ bg: "#D89F4B" }}
                onClick={() => router.push("/")}
                isDisabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                fontWeight="light"
                bgColor="#d5b990"
                _hover={{ bg: "#e3d1b5" }}
                type="submit"
                isDisabled={isSubmitting}
              >
                Tambah Catatan
              </Button>
            </Box>
          </Box>
        </Box>
      </main>
    </>
  );
};

export default NewNotePage;
