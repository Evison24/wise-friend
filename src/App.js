import {
  Container,
  Image,
  Box,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Button,
  Spinner,
} from "@chakra-ui/react";
import photo from "./images/photo.png";
import { Search2Icon } from "@chakra-ui/icons";
import { useState, useLayoutEffect } from "react";
import axios from "axios";
import FadeInSection from "./components/FadeInSection";

function App() {
  const [search, setSearch] = useState("");
  const [searchStart, setSearchStart] = useState(false);
  const [searchInfo, setSearchInfo] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);

  useLayoutEffect(() => {
    const handleSearch = async (e) => {
      const res = await axios.get(
        `https://wikipedia.org/w/api.php?&origin=*&format=json&action=query&list=search&prop=info&inprop=url&utf8=&srlimit=5&srsearch=${search}`
      );
      setResults(res.data.query.search);
      setSearchInfo(res.data.query.searchinfo);
    };
    if (search && search !== "" && search?.length > 3) {
      if (searchInfo?.totalhits === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
      }
      setSearchStart(true);
      const timer = setTimeout(() => {
        handleSearch();
        setIsLoading(false);
      }, 1000);

      return () => {
        clearTimeout(timer);
        setIsLoading(true);
      };
    } else {
      setSearchStart(false);
    }
  }, [search, searchInfo.totalhits]);

  return (
    <>
      <Container maxW={"100%"} minH={"100vh"} bg={"ghostwhite"}>
        <Container centerContent>
          <Heading color={"teal.600"} size={"2xl"} mb={"10px"} mt={"25px"}>
            Wise Friend
          </Heading>
          <Text
            color={"teal.500"}
            mb={"10px"}
            fontSize="lg"
            as="cite"
            textAlign={"center"}
          >
            Your virtual friend that knows everything !
          </Text>
          <Box>
            <Image draggable={"false"} src={photo} />
          </Box>
          <InputGroup mb={"30px"}>
            <InputLeftElement pointerEvents="none" children={<Search2Icon />} />
            <Input
              borderRadius={"20px"}
              borderColor={"blackAlpha.700"}
              type={"text"}
              bgColor={"whiteAlpha.400"}
              color={"whiteAlpha"}
              fontSize={"20px"}
              placeholder={"I know a lot of things try me out..."}
              id={"search-input"}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
          {searchStart && noResults ? (
            <Text
              color={"green"}
              mb={"10px"}
              fontSize="lg"
              as="cite"
              textAlign={"center"}
            >
              Sorry friend i don't have any info about this !
            </Text>
          ) : (
            search?.length > 0 &&
            search?.length < 4 && (
              <Text color={"green"} fontSize="lg" as="cite">
                I will help you after you type a word with at least 4 characters
              </Text>
            )
          )}
          {searchStart && !isLoading
            ? results.map((result, index) => {
                return (
                  <FadeInSection key={index}>
                    <Box
                      borderRadius={"15px"}
                      justifyContent={"flex-start"}
                      bg={"blackAlpha.200"}
                      w={[250, 350, 500, 500, 750, 850]}
                      mb={"30px"}
                    >
                      <Heading
                        size={"lg"}
                        color={"teal.700"}
                        pl={"15px"}
                        pt={"15px"}
                      >
                        {result.title}
                      </Heading>
                      <Text
                        dangerouslySetInnerHTML={{ __html: result.snippet }}
                        my={"15px"}
                        pl={"20px"}
                        fontSize={"20px"}
                      ></Text>
                      <Button
                        ml={"20px"}
                        mb={"20px"}
                        colorScheme="teal"
                        variant="solid"
                      >
                        <Link
                          fontSize={"20px"}
                          href={`https://en.wikipedia.org/?curid=${result.pageid}`}
                          isExternal
                        >
                          Read more...
                        </Link>
                      </Button>
                    </Box>
                  </FadeInSection>
                );
              })
            : searchStart &&
              isLoading && (
                <Text color={"green"} fontSize="lg" as="cite">
                  Hmm,Let me think...{" "}
                  <Spinner
                    thickness="6px"
                    speed="0.65s"
                    emptyColor="green.300"
                    color="blue.500"
                    size="md"
                  />
                </Text>
              )}
        </Container>
      </Container>
    </>
  );
}

export default App;
