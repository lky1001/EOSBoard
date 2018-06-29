#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
#include <eosiolib/action.hpp>

using namespace eosio;
using namespace std;

class board : public contract {
    using contract::contract;
public:

    board(account_name self) : contract(self) {}
    
    void list(uint64_t _page);

    void write(account_name author, string title, string content);

    void read(uint64_t _id);

    void remove(uint64_t _id);
private:
    static uint64_t _id;

    // @abi table
    struct mcontent {
        uint64_t _id;
        string title;
        string content;
        account_name author;
        time created;
        time deleted;

        uint64_t primary_key() const { return _id; }
    };

    typedef multi_index<N(mcontent), mcontent> contents;
};

EOSIO_ABI(board, (list)(write)(read)(remove))
