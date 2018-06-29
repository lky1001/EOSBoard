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

    struct id_sequence {
        id_sequence() {}
        constexpr static uint64_t key = N(id_sequence);
        uint64_t _id = 1;
    }

    void store_id_sequence(const id_sequence &seq) {
        auto iter = db_find_i64(_self, _self, N(id_sequence), id_sequence::key);

        if (iter != -1) {
            db_update_i64(iter, _self, (const char *)&sesq, sizeof(id_sequence));
        } else {
            db_store_i64(_self, N(id_sequence), _self, id_sequence::key, (const char *)&seq, sizeof(id_sequence));
        }
    }

    bool get_id_sequence(id_sequence &seq) {
        auto iter = db_find_i64(_self, _self, N(id_sequence), id_sequence::key);

        if (iter != -1) {
            auto size = db_get_i64(iter, (char *)&seq, sizeof(id_sequence));
            eosio_assert(size == sizeof(id_sequence), "invalid record size.");
            return true;
        }

        return false;
    }

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
