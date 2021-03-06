//
// Intrusive reference counting smart pointer
//
// Copyright (C) 2016-2018 Andreas Gustafsson.  This file is part of
// the Gaborator library source distribution.  See the file LICENSE at
// the top level of the distribution for license information.
//

#ifndef _GABORATOR_REF_H
#define _GABORATOR_REF_H

namespace gaborator {

template <class T> struct ref;

struct refcounted {
    refcounted() { refcount = 0; }
    unsigned int refcount;
};

template <class T>
struct ref {
    ref(): p(0) { }
    ref(T *p_): p(p_) {
        incref();
    }
    ref(const ref &o): p(o.p) {
        incref();
    }
    ref &operator=(const ref &o) { reset(o.p); return *this; }
    ~ref() { reset(); }
    void reset() {
        decref();
        p = 0;
    }
    void reset(T *n) {
        if (n == p)
            return;
        decref();
        p = n;
        incref();
    }
    T *get() const { return p; }
    T *operator->() const { return p; }
    T &operator*() const { return *p; }
    operator bool() const { return p; }
private:
    void incref() {
        if (! p)
            return;
        p->refcount++;
    }
    void decref() {
        if (! p)
            return;
        p->refcount--;
        if (p->refcount == 0)
            delete p;
    }
    T *p;
};

} // namespace

#endif
